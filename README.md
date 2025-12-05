Project screen shots 


![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s1.png)  

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s2.png)

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s3.png)

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s4.png) 

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s5.png)

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s6.png)  

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s7.png)

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s8.png)

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s9.png) 

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s10.png)  

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s11.png)  

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s12.png)

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s13.png)

![MILKDASH](https://raw.githubusercontent.com/VenkateshLatchireddy/MILKDASH/main/Frontend/src/Components/Assets/s14.png) 


# 🥛 MilkDash - Milk Delivery Management System

MilkDash is a full-stack milk delivery management system with separate interfaces for customers and administrators. Customers can browse products, place orders, and track deliveries, while admins can manage orders, stocks, and user data.


### Prerequisites
- Node.js (v16 or higher)
- MySQL Database (or Aiven MySQL)
- npm or yarn


### 1. Clone the Repository
```bash
git clone https://github.com/VenkateshLatchireddy/MILKDASH.git  
cd milkdash



 Set Up Backend  


 cd Backend

npm install



Set Up Frontend   


cd ../Frontend

npm install  


Database Setup  


.env like this 

MYSQL_DATABASE=defaultdb
MYSQL_HOST=milkdash-db-milkdash.aivencloud.com  (changeded)
MYSQL_PORT=12707
MYSQL_USER=avnadmin
MYSQL_PASSWORD=AVNS_Aaoz682vsHYFoDi_     (Changed)
PORT=5000
  

  For db schema i have adeed a zip tar file in Assets  you can import that tables in your workbench  db directly 


📁 Project Structure

Milkdash/
├── Backend/
│   ├── server.js              # Main Express server with Aiven connection
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Aiven MySQL credentials (already provided)
│   └── node_modules/
├── Frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── Components/        # Reusable components
│   │   ├── Pages/            # Page components
│   │   ├── config.js         # API configuration
│   │   └── App.js            # Main React component
│   ├── package.json          # Frontend dependencies
│   
└── README.md                 # This file


🛠️ Technologies Used

Node.js + Express.js - Server framework

MySQL2 with Aiven MySQL - Cloud database

bcryptjs - Password hashing

cors - Cross-origin resource sharing

SSL/TLS - Secure database connection (Aiven)


React.js - Frontend library

React Router - Navigation

Axios - HTTP requests

Tailwind CSS - Styling

Lucide React - Icons


Admin Login:   will be available in admin login page 
Username: 

Password: 

for user test account  :    you can use below credentials 

Username: moon@gmail.com

Password: moon@123   



