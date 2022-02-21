# Property Listing Manager

A property listing management system. The project is implemented in 
Java using:

* `Spring Boot`, with `H2 database` (in-memory), for the backend
* `React` for the frontend

The respective sources can be found at:


[Backend](/src)  
[Frontend](/ui)

### Backend

The backend uses the `Java Persistence API (JPA)` to persist the objects used in the project (`User` and `Listing`) into the `H2 database`.

#### Initial data

On server start-up, [UserDataGenerator](src/main/java/gr/kalaentzis/projectlistingmanager/UserDataGenerator.java) class
creates two test users with the following credentials:
```
username: spitogatos, password: pass
username: kalaentzis, password: 123
```




The user `spitogatos` also owns two listings, whereas user `kalaentzis` doesn't have any.

### Frontend

The frontend consists of two web pages, a login screen and a dashboard, once a user is authenticated.

At the login screen, a user must provide valid credentials to log in to the service
(see: [Initial Data](#initial-data))

Once the user is authenticated, they are navigated to their dashboard, where they can view, delete and add new listings to the service.
## Enrivonment Setup and Run
This project requires `maven` and `JDK 17`. Installation paths can be changed, but commands need to be changed accordingly.
Once the server is deployed, it will be available at ```http://localhost:8080```

#### [Windows]


* Download project from here: [project](https://github.com/gkalaent/PropertyListingManager/archive/refs/heads/master.zip)
and extract it to `C:\ `
* If `JDK 17` is not installed, download and install from here: [JDK 17]( https://download.oracle.com/java/17/latest/jdk-17_windows-x64_bin.exe) 
* If `maven` is not installed, download from here: [maven]( https://dlcdn.apache.org/maven/maven-3/3.8.4/binaries/apache-maven-3.8.4-bin.zip) and extract it to `C:\ `
* Open a terminal and run the following commands:
```aidl
$env:JAVA_HOME='C:\Program Files\Java\jdk-17.0.2'
$env:Path += ';C:\Program Files\Java\jdk-17.0.2\bin'
$env:Path += ';C:\apache-maven-3.8.4\bin'
cd C:\ProperyListingManager-master\ProperyListingManager-master
mvn spring-boot:run
```

#### [MacOS]
* If `JDK 17` is not installed, download and install from here: [JDK 17](https://download.oracle.com/java/17/archive/jdk-17.0.2_macos-aarch64_bin.dmg)
* If `maven` is not installed, run the following commands in a terminal:
```
(cd ~; mkdir project)
cd project
curl -k -o apache-maven-3.8.4-bin.zip https://dlcdn.apache.org/maven/maven-3/3.8.4/binaries/apache-maven-3.8.4-bin.zip
unzip apache-maven-3.8.4-bin.zip
export PATH=~/project/apache-maven-3.8.4/bin:$PATH
```
* Download the project and run with the following commands:
```
(cd ~; mkdir project) // If it was not already created in previous step
cd project 
git clone https://github.com/gkalaent/PropertyListingManager.git
cd PropertyListingManager
mvn spring-boot:run
```

#### [Linux]
* If `JDK 17` is not installed, run the following commands:
```
curl -k -o openjdk-17_linux-x64_bin.tar.gz  https://download.java.net/java/GA/jdk17/0d483333a00540d886896bac774ff48b/35/GPL/openjdk-17_linux-x64_bin.tar.gz
tar -xvf openjdk-17_linux-x64_bin.tar.gz
mv jdk-17 /opt/
export JAVA_HOME=/opt/jdk-17
export PATH=$JAVA_HOME/bin:$PATH
```

* If `maven` is not installed, run the following commands in a terminal:
```
(cd ~; mkdir project)
cd project
curl -k -o apache-maven-3.8.4-bin.zip https://dlcdn.apache.org/maven/maven-3/3.8.4/binaries/apache-maven-3.8.4-bin.zip
unzip apache-maven-3.8.4-bin.zip
export PATH=~/project/apache-maven-3.8.4/bin:$PATH
```
* Download the project and run with the following commands:
```
(cd ~; mkdir project) // If it was not already created in previous step
cd project 
git clone https://github.com/gkalaent/PropertyListingManager.git
cd PropertyListingManager
mvn spring-boot:run
```


