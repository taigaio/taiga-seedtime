# Taiga Seed

## Introduction

Taiga Seed is an agile estimation solution linked to Taiga. Taiga users can load their projects and estimate the relative weight of userSories chosen in a very fast way with this tool.

## Install

You can use `npm` to install

With npm:

```bash
  npm install
```

## Development

Seed architecture diagram software

![Seed architecture diagram software](Seed.png)

## Dependencies

- **Node**: = 16.19.1
- **Vue draggable**: https://github.com/SortableJS/Vue.Draggable
- **Vue translate**: https://github.com/javisperez/vuetranslate

## Linters

```bash
  > npm run lint:js && lint:css
```

## Tests

```bash
  // test normal with watcher
  > npm run test

  // test coverage
  > npm run test:coverage

  // test clear Jest cache
  > npm run clear_jest

  // test jest with debugger stopper
  > npm run test-debug
```

---

## Taiga backend

We should have postgreSQL and RabbitMQ started

```bash
> sudo systemctl restart postgresql
> sudo systemctl start rabbitmq
```

Run **taiga-back**

```bash
> cd taiga-back
> workon taiga-back
> python manage.py runserver
```

Run **taiga-events**

```bash
> cd taiga-events
> coffee index.coffee
```

Run **taiga-front**

```bash
> cd taiga-front
> sudo pacman -S ruby
> gem install --user-install sass scss_lint
> npm install
> node_modules/gulp/bin/gulp.js
```

**Admin Games Panel**

http://localhost:8000/admin/

    admin / 123123

**API Endpoint**

http://localhost:8000/api/v1/games/

**Taiga user**

http://localhost:9001/

    admin / 123123
