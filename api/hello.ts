export default function handler(request: any, response: any) {
  return response.status(200).json({
    hello: 'world!'
  })
}
