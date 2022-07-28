export const tools = {
    separator: ',',
    persianNumbers: [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers: [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
  
    fixNumbers: (str : string) => {
        if (typeof str === 'string') {
            for (let i = 0; i < 10; i++) {
                str = str.replace(tools.persianNumbers[i], i.toString() ).replace(tools.arabicNumbers[i], i.toString());
            }
        }
        return str;
    },
  
    toPersianDigits: (str : string) => {
        const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.replace(/[0-9]/g, function (w) {
            return id[+w]
        });
    },
  
    toCurrencyFormat: (str : string) => {
        return tools.toNumber(str).toString().replace(/\B(?=(\d{3})+(?!\d))/g, tools.separator);
    },
  
    toNumber: (str : string) => str.length > 0 ? parseInt(tools.fixNumbers(str).split(tools.separator).join('')) : str
  }