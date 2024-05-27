import bcrypt from 'bcrypt'

const createHash = async (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// La seguridad la da el ancho del codigo (cantidad de caracteres)

//Password es el que ingresamos en el login - user es el de la base de datos
export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

