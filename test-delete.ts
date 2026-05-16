async function testDelete() {
  const res = await fetch('http://localhost:3000/api/jobs/1', { method: 'DELETE' });
  console.log(res.status);
}
testDelete();
