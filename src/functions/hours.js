import moment from "moment";
import "moment-timezone";
import { defaultOpt } from "../../config/index";
import { useText } from "./text";

export function exceptions(locationExceptions){
  // Function to make IE9+ support forEach:
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }


  if(locationExceptions === null ||  locationExceptions === undefined) return;

  var today = moment().format("YYYY-MM-DD");
  let except = ''
  locationExceptions.forEach(el => {
    let ex = moment(el.date).format("YYYY-MM-DD");
    if(today == ex){
      if(el.message){
        except = el.message;
      }
    }
  });

  return except;
}

export function hoursConditions(operationalHours) {

  if (!operationalHours.hours) return;
  const hours = operationalHours.hours;
  const exceptions = operationalHours.exceptions;

  var format = "HH:mm:ss";
  var tmz = defaultOpt.local;

  // Get current time in Hawaii
  var hwt = moment.tz(moment(), tmz);
  var hawaiianTime = moment.tz(hwt.format(format), format, tmz);

  // Determin day of the week
  var dow = hwt.format("dddd").toLowerCase();

  let today = hours[dow];

  if (!today.hours) return;

  var end, endMinus;
  var start = moment.tz(today.hours[0].openTime, format, tmz);

  // If 2 open close times in a day use second
  if (today.hours[1]) {
    end = moment.tz(today.hours[1].closeTime, format, tmz);
    endMinus = moment
      .tz(today.hours[1].closeTime, format, tmz)
      .subtract(2, "hours");
  } else {
    end = moment.tz(today.hours[0].closeTime, format, tmz);
    endMinus = moment
      .tz(today.hours[0].closeTime, format, tmz)
      .subtract(2, "hours");
  }

  // Opens at formatted
  var s = moment(start).format("h:mm A");
  // Closing time formatted
  var d = moment(end).format("h:mm A");

  switch (true) {
    case hawaiianTime.isBefore(start):
      return `${useText('opensat')}: ${s}`;

    case hawaiianTime.isAfter(end):
      return `${useText('closed')}`;

    case hawaiianTime.isBetween(endMinus, end):
      return `${useText('closingsoon')}: ${d}`;

    case hawaiianTime.isBetween(start, endMinus):
      return `${useText('openuntil')}: ${d}`;

    default:
      return;
  }
}