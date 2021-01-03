-- MySQL dump 10.13  Distrib 5.7.14, for Win64 (x86_64)
--
-- Host: localhost    Database: geography
-- ------------------------------------------------------
-- Server version	5.7.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `geography`;
CREATE DATABASE `geography`;
USE `geography`;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country` (
  `co_code` varchar(3) NOT NULL,
  `co_name` varchar(200) NOT NULL,
  `co_details` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`co_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES ('IRL','Republic of Ireland','Ireland also described as the Republic of Ireland (Poblacht na hÉireann), is a sovereign state in north-western Europe occupying 26 of 32 counties of the island of Ireland.'),('USA','United States of America','The United States of America , commonly known as the United States (U.S.) or America, is a constitutional federal republic composed of 50 states, a federal district, five major self-governing territories, and various possessions.'),('UK','United Kingdom','The United Kingdom of Great Britain and Northern Ireland, commonly known as the United Kingdom (UK) or Britain, is a sovereign country in western Europe.'),('FRA','France','France is a country in Western Europe with overseas regions and territories');
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `city` (
  `cty_code` varchar(3) NOT NULL,
  `co_code` varchar(3) NOT NULL,
  `cty_name` varchar(200) NOT NULL,
  `population` int(20) NOT NULL,
  `isCoastal` enum('true','false') DEFAULT NULL,
  `areaKM` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`cty_code`),
  FOREIGN KEY (`co_code`) REFERENCES `country`(`co_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES ('DUB','IRL','Dublin',553165,'true',114.99),('SWO','IRL','Swords',68683,'true',11.35),('GAL','IRL','Galway',79934,'true',53.35),('LOU','IRL','Loughrea',5057,'false',25.35),('GOR','IRL','Gort',2644,'false',19.91),('ATH','IRL','Athlone',21349,'false',30.00),('MUL','IRL','Mullingar',20928,'false',28.23),('NYK','USA','New York',8537673,'true',468.48),('ALB','USA','Albany',98469,'false',56.20),('GVL','USA','Greenville',3739,'false',39.10),('LON','UK','London',8673713,'false',1572.00),('MAR','UK','Margate',61223,'true',23.40),('SAN','UK','Sandwich',4985,'false',13.00);
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-06-15 10:00:26
