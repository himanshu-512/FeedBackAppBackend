export function generateUsername() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `User_${random}`;
}
