## Run

Paginacao nas abas (Mensagens, Financeiro, Histórico)
Quando entra um pedido descontar a quantidade do item no stock
Adicionar redes socias do Restaurante, e permitir partilhar os pratos la.

```sh
https://socket.io/how-to/use-with-react

docker compose up -d --build order

docker exec -it f2d-redis-1 sh
redis-cli

GET nome_da_chave
KEYS *
FLUSHDB

```

```bash
g class common/dto/pagination-query.dto --flat --no-spec --dry-run

# ssh -lroot -p22 109.205.183.229
# contabo: zelitosaide83@gmail.com:KRHbFiVGR4cS
# contabo:server: zelitosaide83@gmail.com:JoanaZelito@1
# ssh root@www.lab.med.uem.mz -p 30 -> lab
# ssh root@www.med.uem.mz -p 32 -> med
# sqlite3 caminho/para/banco.db
# npm install
```

```bash
npm run start:dev -> order
npm run start:dev -> payment
npm run start:dev -> restaurant
npm run start:dev -> user

# run
docker compose up
```

## Next

```bash
https://learn.nestjs.com/courses/microservices/lectures/51602002 -> Next

Server setup next: https://www.youtube.com/watch?v=w5E7ER6Eo2Y&list=PLdHg5T0SNpN38gy5xZ0PVEaDdZXlPkgP9&index=10
```

## Server Setup

```bash
sudo apt update && sudo apt upgrade -y

sudo apt update && sudo apt install -y \
  curl \
  vim \
  git \
  wget \
  build-essential \
  nmap \
  iproute2

sudo apt update && sudo apt upgrade
```

```bash
ssh -lroot -p22 109.205.183.229
```

```bash
curl --request POST 'https://api.sandbox.vm.co.mz:18352/ipg/v1x/c2bPayment/singleStage/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer Aw/02o6OqWpqGAW7wksqo3FHGTBUFPCcWK8YxxLWuXa8dD+RJv1V8ICgO5D8wj85XlktNCNQ40E7jF1RnwliEtTGPro+y7+Gszp8chyBTW2UhOAUZDTgIocw9ZhmMY8hN+aupXt7+xnpK1yw+Z6q4LBxze5k/tQCiLuhH6c9zDiWyQ1QiOrRLppKtUjjqPqG9ulfwviChTrkH77LMIQxs1hz0txT08IauSGnLoM9s5Sa7uxLj9NY72N6ZxWf3KTHVwxlkDI3mAkvsxqwHK6xzQKHmt3hVrkYL8kLrOGs5ZjtAy3G/JEhM/Ddu25aerJsoaqmcMt8VSJuQZyG82gSGssHRp3/bSri8gzjY9I7YFhiAE0ihDnOnwVw0Q39txKpnn9vQ7NC/OlqBoZ59zVkVf6LWTDUebcyk8Y7ykMnLeYth+fg+hWXOytD6Hhe1FJmPX96Yd9ZhN819AOTLaiUf5A2K9B20O/wTXnU52LunB4HHbD3lEQT7y14SGZb6IKArmVL8nOyOsFVnnAptBYORhec3lM+tYfwVm1C643/KoCiigsQk2cEqyEnzazeYTG61jFqDyzMxmwmHKS2X0obkkKSc11hBuIolAdH2VLL56YA6uRZY2VjioQ9NXjItSffMQYWKVF8RAtsZC7+nzzqL2fUwm/Ff0dxDmPPG8R1Bhg=' \
--header 'Origin: developer.mpesa.vm.co.mz' \
--data '{
  "input_TransactionReference":"T12344C",
  "input_CustomerMSISDN":"258842520280",
  "input_Amount":"10",
  "input_ThirdPartyReference":"879089",
  "input_ServiceProviderCode":"171717"
}'
```
