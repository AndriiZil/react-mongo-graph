const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformEvent, transformBooking } = require('../resolvers/merge');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('403 Forbidden!');
    }

    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (e) {
      throw e;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('403 Forbidden!');
    }

    const fechedEvent = await Event.findOne({ _id:args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fechedEvent
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('403 Forbidden!');
    }

    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (e) {
      throw e;
    }
  }
};