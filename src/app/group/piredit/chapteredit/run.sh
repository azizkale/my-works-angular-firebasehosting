echo "start"

 docker build -t easyread_angular . || true

 docker stop easyread_angular-web || true

 docker run --name easyread_angular-web -d -p 4001:80 --rm easyread_angular:latest

echo "end"