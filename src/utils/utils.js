const dateFormatFun = (date) => {
  if (!date) {
    return null;
  }
  let dateFormat = '';
  const dateLength = date.split('-').length;
  switch (dateLength) {
    case 1:
      dateFormat = '%Y';
      break;
    case 2:
      dateFormat = '%Y-%m';
      break;
    case 3:
      dateFormat = '%Y-%m-%d';
      break;
    default:
      break;
  }
  return dateFormat;
};
module.exports = {
  dateFormatFun
};
