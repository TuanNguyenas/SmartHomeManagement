const prisma = require("../init.prisma");

const insertUser = async (user) => {
  const result = await prisma.users
    .create({
      data: user,
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  return result;
};

const getUserByEmail = async (email) => {
  const result = await prisma.users
    .findUnique({
      where: {
        email: email,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  return result;
};

const getUserByUserId = async (user_id) => {
  const result = await prisma.users
    .findUnique({
      where: {
        id: parseInt(user_id),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  return result;
};

const removeTokenById = async (id) => {
  const result = await prisma.users
    .update({
      where: {
        id: parseInt(id),
      },
      data: {
        access_token: "",
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  return result;
};

const setTokenById = async (access_token, id) => {
  const result = await prisma.users
    .update({
      where: {
        id: id,
      },
      data: {
        access_token: access_token,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  return result;
};

const updatePasswordById = async (new_password, salt, id) => {
  const result = await prisma.users
    .update({
      where: {
        id: id,
      },
      data: {
        password_hash: new_password,
        salt: salt,
      },
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  return result;
};

const getUserByHomeId = async (home_id) => {
  const result = await prisma.user_have_home
    .findMany({
      where: {
        home_id: parseInt(home_id),
      },
    })
    .catch((err) => {
      console.error(err);
    });

  return result;
};

module.exports = {
  getUserByHomeId,
  insertUser,
  getUserByEmail,
  removeTokenById,
  setTokenById,
  updatePasswordById,
  getUserByUserId,
};
