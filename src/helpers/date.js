import dayjs from "dayjs";
import "@/locales/es/dayjs";

dayjs.locale('es');

const $date = function(date = null) {
  const $dayjs = date ? dayjs(date) : dayjs();
  
  return {
    $dayjs,
    format(format = 'DD-MM-YYYY') {
      return $dayjs.format(format);
    }
  }
};

export default $date;
