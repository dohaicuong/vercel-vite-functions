```
const ids = await fetch('https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/stream/live_inputs', {
  headers: {
    authorization: 'Bearer TOKEN'
  }
})
.then(res => res.json())
.then(data => data.result.map(({ uid }) => uid))

for (const id of ids) {
  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/ACCOUNT_ID/stream/live_inputs/${id}`,
    {
      method: 'DELETE',
      headers: {
        authorization: 'Bearer TOKEN'
      }
    }
  )
  .then(res => res.json())
  .then(console.log)
}
```