import { StatusInfo, DataOutputType, Result } from './wps_2.0';


export const isStatusInfo = (obj: object): obj is StatusInfo => {
  return obj.hasOwnProperty('jobID')
    && obj.hasOwnProperty('status');
};

export const isDataOutputType = (obj: object): obj is DataOutputType => {
  return obj.hasOwnProperty('id') &&
    (obj.hasOwnProperty('data') || obj.hasOwnProperty('reference') || obj.hasOwnProperty('output'));
};

export const isResult = (obj: object): obj is Result => {
  return (obj.hasOwnProperty('output'));
};

export function decodeEntities(encodedString: string) {
  var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  var translate: {[k: string]: string} = {
      "nbsp":" ",
      "amp" : "&",
      "quot": "\"",
      "lt"  : "<",
      "gt"  : ">"
  };
  return encodedString.replace(translate_re, function(match, entity) {
      return translate[entity];
  }).replace(/&#(\d+);/gi, function(match, numStr) {
      var num = parseInt(numStr, 10);
      return String.fromCharCode(num);
  });
}