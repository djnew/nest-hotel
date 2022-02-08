#Консольные команды
```shell
$ npx nestjs-command --help                                        
cli <command>

Commands:
  cli create:user  create a user

```
#Создание пользователя с консоли
```shell
$ npx nestjs-command create:user --help
cli create:user

create a user

Positionals:
  role, r      user role: client | admin | manager                      [string]
  password, p  user password                                            [string]
  email, e     user email                                               [string]

$ npx nestjs-command create:user -e test@test.ru -r admin -p 123123
{
  role: 'admin',
  passwordHash: '***',
  name: 'test@test.ru',
  email: 'test@test.ru',
  contactPhone: '79000000000',
  _id: new ObjectId("***"),
  __v: 0
}
```
