const charFetch = async () => {
  const response = await fetch('/getChar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const responseJSON = await response.json();
  // console.log('client ===>', char);
  return responseJSON.body;
};

const char = charFetch();
module.exports = { char };
