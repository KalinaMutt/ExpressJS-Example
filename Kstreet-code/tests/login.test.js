const login= require("./login")
let logins=[{org:1,fname:"Kalina",lname:"Street",password:"s",admin:0},
{org:1,fname:"KALINA",lname:"STREET",password:"s",admin:0},
{org:"",fname:"Kalina",lname:"Street",password:"s",admin:0},
{org:"d",fname:"Kalina",lname:"Street",password:"s",admin:0},
{org:1,fname:"",lname:"Street",password:"s",admin:0},
{org:1,fname:"     ",lname:"Street",password:"s",admin:0},
{org:1,fname:"Kalina",lname:"",password:"s",admin:0},
{org:1,fname:"Kalina",lname:"Street",password:"",admin:0},
{org:1,fname:"Kamil",lname:"Kozibura",password:"s",admin:1},
{org:1,fname:"KAMIL",lname:"KOZIBURA",password:"s",admin:1},
{org:1,fname:"Fake",lname:"User",password:"password",admin:0}]
let results=["Registered Staff",
"Registered Staff",
"Blank organisation",
"Organisation is not a number",
"Blank firstname",
"Blank firstname"
,"Blank lastname"
,"Blank password"
,"Registered Admin"
,"Registered Admin"
,"User not registered"]

test('login tests', () => {
    for(var i=0;i<logins.length;i++) {
        expect(login(logins[i])).toBe(results[i]);
    }
    
  });