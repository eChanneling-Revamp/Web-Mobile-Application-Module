export function generateAppointmentNumber() {
  const date = new Date();
  const yyyyMMdd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `APT-${yyyyMMdd}-${random}`;
}
