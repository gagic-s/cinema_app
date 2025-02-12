import RetrieveScreeningResponse, {
  ScreeningMovie,
} from "../dto/screening/screening.dto";
const mapMovieInfoForScreening = (
  movieId: any,
  movie: { name: any; duration: any; posterImage: any }
): ScreeningMovie => {
  return {
    movie_id: movieId,
    name: movie.name,
    duration: movie.duration,
    posterImage: movie.posterImage,
  };
};
const formatTickets = (tickets: any) => {
  return tickets.map(
    (ticket: any) => `${ticket.ticket_column}-${ticket.ticket_row}`
  );
};

class ScreeningMapper {
  toRetrieveScreeningResponse(screening: any): RetrieveScreeningResponse {
    return {
      id: screening.screening_id,
      screeningDate: screening.screeningDate,
      screeningTime: screening.screeningTime,
      ticketPrice: screening.ticketPrice,
      screeningColumns: screening.screeningColumns,
      screeningRows: screening.screeningRows,
      movie: mapMovieInfoForScreening(screening.movie_id, screening.movie),
      tickets: formatTickets(screening.Tickets),
    };
  }
}

export default new ScreeningMapper();
