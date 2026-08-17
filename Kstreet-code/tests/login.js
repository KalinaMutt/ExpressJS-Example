function login(user) {
  if (user.org.toString().trim()==='') {
    return "Blank organisation"
  }
  else if (Number.isFinite(parseInt(user.org))===false) {
      return "Organisation is not a number"
  }
  else if (user.fname.trim()==='') {
      return "Blank firstname"
  }
  else if (user.lname.trim()==='') {
      return "Blank lastname"
  }
  else if (user.password.trim()==='') {
      return "Blank password"
  }
  else {
    var hash=0
    for (var i=0;i<user.password.length ;i++) {
      var atbl=user.password.charCodeAt(i)
      hash +=atbl*(Math.floor(atbl/5)) *(i+1)
    }
  if (user.org===1 && user.fname.trim().toLowerCase()==="kalina" && user.lname.trim().toLowerCase()==="street" && hash===2645 && user.admin===0) {
    return "Registered Staff"
      
  }
  else if (user.org===1 && user.fname.trim().toLowerCase()==="kamil" && user.lname.trim().toLowerCase()==="kozibura" && hash===2645 && user.admin===1) {
      return "Registered Admin"
  }
  else {
      return "User not registered"
  }
}
}
module.exports=login;