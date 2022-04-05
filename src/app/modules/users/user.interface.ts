export interface User{
  name:String,
  login:String,
  password:String,
  phone:String,
  image:String,
  company:any,
  coordonnees:[{name:String,coords:{longitude :String , latitude:String}}],
  role:String,
  espace:any,
  createdBy:String,
  createdAt:String,
  favourites: [{product:String}]
}
