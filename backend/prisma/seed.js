const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

const main = async () => {
  // Seed user data
  const User = require("./data/User.json");
  await prisma.users.createMany({
    data: User,
  });

  // Seed other data
  const Home = require("./data/Home.json");
  await prisma.home.createMany({
    data: Home,
  });

  const User_Have_Home = require("./data/User_Have_Home.json");
  await prisma.user_have_home.createMany({
    data: User_Have_Home,
  });

  const Device = require("./data/Device.json");
  await prisma.device.createMany({
    data: Device,
  });
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
