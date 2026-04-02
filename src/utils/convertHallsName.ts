export default function convertName(hall_name: string): string {
  const newHall_name: number = Number(hall_name.match(/\d+/));
  return newHall_name + " ЗАЛ";
}

// UPD: Больше не используем 
// Название зала - это строка - и отображаться должна строка