# sicredi-test-api

## Simple API using vercel and mongodb
Developed following vercel guide for nodejs api. (https://vercel.com/guides/deploying-a-mongodb-powered-api-with-node-and-vercel#step-3:-local-development)

## Running the API
- Install vercel cli `npm i -g vercel`
- Run `vercel dev` to run locally


APIs
Login
POST endpoint/login
  { name: string }
Simulação
GET simulacao
  {
      id: string,
      ssn: string,
      status: 'PENDING' | 'HIRED',
      requestedAmount: number
   }[]
GET simulacao/:id

    {
        id: string,
        ssn: string,
        status: 'PENDING' | 'HIRED',
        requestedAmount: number,
        totalAmount: number,
        installmentsNumber: number,
        monthlyInterest: number
     }
POST simulacao

body:

    {
        id: string,
        ssn: string,
        amount: number,
        installmentsNumber: number
     }
response:

    {
        id: string,
        ssn: string,
        requestedAmount: number,
        totalAmount: number,
        installmentsNumber: number,
        monthlyInterest: number
     }
PUT simulacao/:id

    {
        status: 'PENDING' | 'HIRED'
    }