import { UUID } from "crypto";
import databaseInstance, { Reservation, Ticket } from "../db/index.js";
import { DatabaseException } from "../exceptions/DatabaseException.js";
import { Op } from "sequelize";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { Sequelize } from "sequelize-typescript";
import CreateReservationRequest from "../dto/reservations/createReservation.dto.js";

interface IReservationRepository {
  save(reservationData: CreateReservationRequest): Promise<any>;
  retrieveAll(searchParams: { screening_id: string }): Promise<Reservation[]>;
  retrieveById(screeningId: UUID): Promise<Reservation>;
  update(screening: Reservation): Promise<number>;
  delete(screeningId: UUID): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class ReservationRepository implements IReservationRepository {
  async save(reservationData: CreateReservationRequest): Promise<any> {
    const sequelize: Sequelize = databaseInstance.sequelize as Sequelize;

    return await sequelize.transaction(async (transaction) => {
      try {
        // Create the reservation
        const reservation = await Reservation.create(
          {
            screening_id: reservationData.screening_id,
            reservationCode: reservationData.reservationCode,
            email: reservationData.email,
            totalPrice: reservationData.totalPrice,
          },
          {
            transaction,
          }
        );

        // Add reservation_id to each ticket in ticketsData
        const ticketsWithReservationAndScreeningId =
          reservationData.ticketsData.map((ticket) => ({
            ticket_row: +ticket.ticket_row,
            ticket_column: +ticket.ticket_column,
            reservation_id: reservation.reservation_id,
            screening_id: reservation.screening_id,
          }));

        // Create each ticket associated with the reservation
        const tickets = await Promise.all(
          ticketsWithReservationAndScreeningId.map((ticketData) =>
            Ticket.create(ticketData, { transaction })
          )
        );

        // Return the reservation and its associated tickets
        return { reservation, tickets };
      } catch (error: any) {
        // Any error here will automatically trigger a rollback
        throw new DatabaseException(error.message);
      }
    });
  }

  async retrieveAll(searchParams: {
    screening_id: string;
  }): Promise<Reservation[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.screening_id) {
        condition.name = { [Op.iLike]: `%${searchParams.screening_id}%` };
      }

      const reservations = await Reservation.findAll({
        where: condition,
        include: [
          {
            model: Ticket,
            attributes: ["ticket_row", "ticket_column"],
          },
        ],
      });
      return reservations;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async retrieveById(reservationId: UUID): Promise<Reservation> {
    try {
      const reservation = await Reservation.findByPk(reservationId, {
        include: {
          model: Ticket,
          attributes: ["ticket_row", "ticket_column"],
        },
      });
      if (!reservation) {
        throw new NotFoundException("Reservation");
      }

      return reservation;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async update(reservation: Reservation): Promise<number> {
    const { reservation_id, screening_id, reservationCode, email, totalPrice } =
      reservation;
    try {
      const affectedRows = await Reservation.update(
        {
          reservation_id,
          screening_id,
          reservationCode,
          email,
          totalPrice,
        },
        { where: { reservation_id: reservation_id } }
      );

      return affectedRows[0];
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async delete(reservation_id: UUID): Promise<number> {
    try {
      const affectedRows = await Reservation.destroy({
        where: { reservation_id: reservation_id },
      });
      return affectedRows;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }
}

export default new ReservationRepository();
