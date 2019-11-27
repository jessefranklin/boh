import moment from "moment";
import "moment-timezone";
import { defaultOpt, groups } from "../../config/index";

export function filterIsOpen(list, open, type) {
  if (!open) return list;

  var format = "HH:mm:ss";
  var tmz = defaultOpt.local;

  // Get current time in Hawaii
  var hwt = moment.tz(moment(), tmz);
  var hawaiianTime = moment.tz(hwt.format(format), format, tmz);
  // Determin day of the week
  var dow = hwt.format("dddd").toLowerCase();

  return list.filter(item => {
    // Is it open 24 hours?
    let open24 = item.operationalHours.open24Hours;
    // Get todays hours
    let itemHrs = item.operationalHours.hours[dow];
    var start, end;
    if (itemHrs.hours !== null) {
      start = moment.tz(itemHrs.hours[0].openTime, format, tmz);
      end = moment.tz(itemHrs.hours[0].closeTime, format, tmz);
      // If 2 open and close times in a day
      var start2, end2;
      if (itemHrs.hours[1]) {
        start2 = moment.tz(itemHrs.hours[1].openTime, format, tmz);
        end2 = moment.tz(itemHrs.hours[1].closeTime, format, tmz);
      }
      // Filtered return conditions (open24 removed from return condition.)

      return (
        hawaiianTime.isBetween(start, end) ||
        hawaiianTime.isSame(start) ||
        hawaiianTime.isSame(end) ||
        hawaiianTime.isBetween(start2, end2) ||
        hawaiianTime.isSame(start2) ||
        hawaiianTime.isSame(end2)
      );
    }
    // Exception to filter by OR with types
    return type.indexOf('ATM') != -1 && item.type.indexOf('ATM') != -1;
  });
}

export function filterByMeta(list, filters) {

  if (
    !filters.meta.atm.length &&
    !filters.meta.branch.length &&
    !filters.meta.specialty.length
  )
    return list;

  let branchFilter = [].concat(filters.meta.branch, filters.meta.specialty);
  return filterOR(list, filters.meta.atm, branchFilter, filters.type);
}

function filterOR(list, atmFilter, branchFilter, type) {
  return list.filter(a => {
    if (!a) return;
    let li = a.meta.atm;
    let branch = [].concat(a.meta.branch, a.meta.specialty);
    
    return filterAND(branch, branchFilter) || filterAND(li, atmFilter) || typeAnd(a,type,atmFilter,branchFilter) ? true : false;
  });
}

function typeAnd(item,type,atm,branch){
    // type.some(e => {
    //   if(item.type.includes(e)) return true;
    // })

  if(branch.length == 0 && type.indexOf('Branch') != -1 && item.type.indexOf('Branch') != -1 || 
    atm.length == 0 && type.indexOf('ATM') != -1 && item.type.indexOf('ATM') != -1) {
    return true;
  }
}

function filterAND(list, filters) {
  if (!filters.length) return false;
  return filters.every(val => {
    return list.includes(val);
  });
}

// Filter list by either ATM or Branch
export function filterByType(list, type) {
  if (!type) return false;

  if (type.length == 2) return list;

  const filter = type[0];
  return list.filter(a => {
    let x = a.type;
    return x.indexOf(filter) !== -1; 
  });

  // return list.filter(arr =>
  //   arr.some(function(arrVal) {
  //     return val === arrVal;
  //   })
  // );
}

// Type selection on filtering
export function filterTypeSelection(payload) {
  // Function to make IE9+ support forEach:
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  var types = []
  for (var key in groups){
    if (!groups.hasOwnProperty(key)) continue;
    groups[key].forEach((item) => {
      if(payload[item].length || payload[item] == true || payload.type.indexOf(key) !== -1 ) {
        if(types.indexOf(key) === -1){
          return types.push(key);
        }
      }
    });
  }

  return types;

}

export function filterById(list, id) {
  return list.filter(a => a.id === id);
}
