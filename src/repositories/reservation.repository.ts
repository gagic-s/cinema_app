import { UUID } from "crypto";
import { Reservation } from "../db/index.js";
import { DatabaseException } from "../exceptions/DatabaseException.js";
import { Op } from "sequelize";
import { NotFoundException } from "../exceptions/NotFoundException.js";

interface IReservationRepository {
  save(
    screening: Reservation,
    reservationCode: string,
    reservationUser?: string
  ): Promise<Reservation>;
  retrieveAll(searchParams: { screening_id: string }): Promise<Reservation[]>;
  retrieveById(screeningId: UUID): Promise<Reservation>;
  update(screening: Reservation): Promise<number>;
  delete(screeningId: UUID): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class ReservationRepository implements IReservationRepository {
  async save(
    reservation: Reservation,
    reservationCode: string
    // reservationUser?: string
  ): Promise<Reservation> {
    try {
      return await Reservation.create({
        screening_id: reservation.screening_id,
        reservationCode: reservationCode,
        email: reservation.email,
        totalPrice: reservation.totalPrice,
        // user_id: reservationUser || null,
      });
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async retrieveAll(searchParams: {
    screening_id: string;
  }): Promise<Reservation[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.screening_id) {
        condition.name = { [Op.iLike]: `%${searchParams.screening_id}%` };
      }

      return await Reservation.findAll({ where: condition });
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async retrieveById(reservationId: UUID): Promise<Reservation> {
    try {
      const reservation = await Reservation.findByPk(reservationId);
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
