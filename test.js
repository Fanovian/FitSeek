const date = new Date('2025-06-05T10:30:00.000Z');
const formatted = date.toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}).replace(/\//g, '-');
console.log('Formatted timestamp:', formatted);
console.log('Split by space:', formatted.split(' '));
console.log('Date part:', formatted.split(' ')[0]);

// 测试解析回日期
const datePart = formatted.split(' ')[0];
const parsedDate = new Date(datePart);
console.log('Parsed date:', parsedDate);
console.log('Is valid date:', !isNaN(parsedDate.getTime()));
