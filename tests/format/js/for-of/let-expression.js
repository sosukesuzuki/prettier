for ((let) of expressioin) {}
for ((let.foo) of expression) {}
for ((let.foo.bar) of expression) {}
for ((/* comment */ let) of expression) {}
for ((     let      ) of expression) {}

async function f() {
  for await ((let) of expressioin) {}
  for await ((let.foo) of expression) {}
  for await ((let.foo.bar) of expression) {}
  for await ((/* comment */ let) of expression) {}
  for await ((     let      ) of expression) {}
}
