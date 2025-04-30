const evenSource = new EventSource("http://localhost:8000/notification");
evenSource.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
};
