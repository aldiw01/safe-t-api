-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2019 at 08:21 PM
-- Server version: 10.1.30-MariaDB
-- PHP Version: 5.6.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `safe_t`
--

-- --------------------------------------------------------

--
-- Table structure for table `data_kendaraan`
--

CREATE TABLE `data_kendaraan` (
  `id` varchar(11) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `brand` varchar(20) NOT NULL,
  `type` varchar(20) NOT NULL,
  `build_year` year(4) NOT NULL,
  `color` varchar(10) NOT NULL,
  `created` varchar(24) NOT NULL,
  `updated` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_kendaraan`
--

INSERT INTO `data_kendaraan` (`id`, `owner`, `brand`, `type`, `build_year`, `color`, `created`, `updated`) VALUES
('A1001LW', 'Aldi Wiranata', 'Honda', 'Sepeda Motor', 2010, 'Merah', '2019-06-05 23:18:06', '2019-07-23T13:34:45.529Z'),
('A1039LW', 'Scotty Daskalos', 'Toyota', 'Sepeda Motor', 2011, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1040LW', 'Boyce Boczkowski', 'Toyota', 'Mobil', 2010, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1041LW', 'Tyree Gahagan', 'Suzuki', 'Sepeda Motor', 2010, 'Biru', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1042LW', 'Eloy Shahidi', 'Suzuki', 'Mobil', 2011, 'Hijau', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1043LW', 'Levi Wollney', 'Suzuki', 'Sepeda Motor', 2012, 'Merah', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1044LW', 'Hung Francke', 'Suzuki', 'Mobil', 2013, 'Hitam', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1045LW', 'Wiley Caples', 'Suzuki', 'Sepeda Motor', 2014, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1046LW', 'Jorge Goodwillie', 'Suzuki', 'Mobil', 2015, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1047LW', 'Curtis Edgecomb', 'Suzuki', 'Sepeda Motor', 2016, 'Biru', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1048LW', 'Domingo Milliard', 'Suzuki', 'Mobil', 2017, 'Hijau', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1049LW', 'Perry Youngberg', 'Suzuki', 'Sepeda Motor', 2018, 'Merah', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1050LW', 'Marc Sternad', 'Suzuki', 'Mobil', 2019, 'Hitam', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1051LW', 'Reggie Angelos', 'Suzuki', 'Sepeda Motor', 2019, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1052LW', 'Lemuel Sheets', 'Suzuki', 'Mobil', 2018, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1053LW', 'Seymour Bloemer', 'Suzuki', 'Sepeda Motor', 2017, 'Biru', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1054LW', 'Saul Beak', 'Suzuki', 'Mobil', 2016, 'Hijau', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1055LW', 'Kevin Harbron', 'Suzuki', 'Sepeda Motor', 2015, 'Merah', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1056LW', 'Reid Boekhoff', 'Suzuki', 'Mobil', 2014, 'Hitam', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1057LW', 'Claude Ll', 'Suzuki', 'Sepeda Motor', 2013, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1058LW', 'Phillip Smedstad', 'Suzuki', 'Mobil', 2012, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1059LW', 'Quinn Mongo', 'Suzuki', 'Sepeda Motor', 2011, 'Biru', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1060LW', 'Irving Rutman', 'Suzuki', 'Mobil', 2010, 'Hijau', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1061LW', 'Buddy Sholl', 'BMW', 'Sepeda Motor', 2010, 'Merah', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1062LW', 'Dee Laneville', 'BMW', 'Mobil', 2011, 'Hitam', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1063LW', 'Michal Arpero', 'BMW', 'Sepeda Motor', 2012, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1064LW', 'Valentine Santilli', 'BMW', 'Mobil', 2013, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1065LW', 'Abraham Kuechenmeister', 'BMW', 'Sepeda Motor', 2014, 'Biru', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1066LW', 'Eusebio Belli', 'BMW', 'Mobil', 2015, 'Hijau', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1067LW', 'Jay Paskus', 'BMW', 'Sepeda Motor', 2016, 'Merah', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1068LW', 'Rufus Steinbrook', 'BMW', 'Mobil', 2017, 'Hitam', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1069LW', 'Humberto Reyez', 'BMW', 'Sepeda Motor', 2018, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1070LW', 'Emmitt Rinear', 'BMW', 'Mobil', 2019, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1071LW', 'Titus Iadarola', 'BMW', 'Sepeda Motor', 2019, 'Biru', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1072LW', 'Tyron Brezina', 'BMW', 'Mobil', 2018, 'Hijau', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1073LW', 'William Gourlay', 'BMW', 'Sepeda Motor', 2017, 'Merah', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1074LW', 'Gene Lutman', 'BMW', 'Mobil', 2016, 'Hitam', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1075LW', 'Tuan Schlau', 'BMW', 'Sepeda Motor', 2015, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1076LW', 'Robt Seago', 'BMW', 'Mobil', 2014, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1077LW', 'Phil Codington', 'BMW', 'Sepeda Motor', 2013, 'Biru', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1078LW', 'Kareem Jakubiak', 'BMW', 'Mobil', 2012, 'Hijau', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1079LW', 'Joaquin Vy', 'BMW', 'Sepeda Motor', 2011, 'Merah', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1080LW', 'Emanuel Bogusch', 'BMW', 'Mobil', 2010, 'Hitam', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1081LW', 'Heath Buckels', 'AUDI', 'Sepeda Motor', 2010, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1082LW', 'Lucio Romanic', 'AUDI', 'Mobil', 2011, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1083LW', 'Reid Landaker', 'AUDI', 'Sepeda Motor', 2012, 'Biru', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1084LW', 'Jefferey Doughan', 'AUDI', 'Mobil', 2013, 'Hijau', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1085LW', 'Virgilio Subramani', 'AUDI', 'Sepeda Motor', 2014, 'Merah', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1086LW', 'Rolland Schrott', 'AUDI', 'Mobil', 2015, 'Hitam', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1087LW', 'Mariano Azelton', 'AUDI', 'Sepeda Motor', 2016, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1088LW', 'Carmelo Fountain', 'AUDI', 'Mobil', 2017, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1089LW', 'Richie Duston', 'AUDI', 'Sepeda Motor', 2018, 'Biru', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1090LW', 'Cordell Loupe', 'AUDI', 'Mobil', 2019, 'Hijau', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1091LW', 'Mose Bantug', 'AUDI', 'Sepeda Motor', 2019, 'Merah', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1092LW', 'Floyd Schenning', 'AUDI', 'Mobil', 2018, 'Hitam', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1093LW', 'Dominick Nguyent', 'AUDI', 'Sepeda Motor', 2017, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1094LW', 'Jerome Baytops', 'AUDI', 'Mobil', 2016, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1095LW', 'Davis Turdik', 'AUDI', 'Sepeda Motor', 2015, 'Biru', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1096LW', 'Louis Gnoza', 'AUDI', 'Mobil', 2014, 'Hijau', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1097LW', 'Gerardo Shneyder', 'AUDI', 'Sepeda Motor', 2013, 'Merah', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1098LW', 'Jeff Takenaka', 'AUDI', 'Mobil', 2012, 'Hitam', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1099LW', 'Graig Mcgorry', 'AUDI', 'Sepeda Motor', 2011, 'Putih', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A1100LW', 'Hong Bachmann', 'AUDI', 'Mobil', 2010, 'Silver', '2019-06-05 23:18:06', '2019-06-05 23:18:06'),
('A6380ZH', 'Shelby Goin', 'Honda', 'Sepeda Motor', 2012, 'Putih', '2019-06-05 23:18:06', '2019-08-08T02:39:46.700Z'),
('AB2015HF', 'Terrell Bondie', 'Honda', 'Mobil', 2011, 'Hitam', '2019-06-05 23:18:06', '2019-08-01T07:11:23.252Z'),
('AB5571SA', 'Dudley Luster', 'Toyota', 'Mobil', 2017, 'Silver', '2019-06-05 23:18:06', '2019-08-14T09:11:55.527Z'),
('B2312KB', 'Tony Barnette', 'Honda', 'Sepeda Motor', 2014, 'Biru', '2019-06-05 23:18:06', '2019-08-08T02:40:34.438Z'),
('B313ULA', 'Hector Haise', 'Honda', 'Mobil', 2010, 'Hitam', '2019-06-05 23:18:06', '2019-08-14T08:02:12.793Z'),
('B3198UPZ', 'Faustino Gellatly', 'Toyota', 'Sepeda Motor', 2012, 'Biru', '2019-06-05 23:18:06', '2019-08-14T08:02:50.882Z'),
('B3201SPV', 'Gonzalo Marletta', 'Honda', 'Sepeda Motor', 2015, 'Putih', '2019-06-05 23:18:06', '2019-08-14T08:01:09.123Z'),
('B363GIG', 'Marlin Witsman', 'Honda', 'Mobil', 2017, 'Hitam', '2019-06-05 23:18:06', '2019-08-08T02:41:52.794Z'),
('B457UTY', 'Quinn Geddings', 'Honda', 'Sepeda Motor', 2011, 'Merah', '2019-06-05 23:18:06', '2019-08-14T08:02:00.692Z'),
('B4899THD', 'Edward Woerth', 'Honda', 'Mobil', 2016, 'Hitam', '2019-06-05 23:18:06', '2019-08-14T08:00:56.766Z'),
('B4928TKX', 'Ramiro Salom', 'Honda', 'Sepeda Motor', 2018, 'Putih', '2019-06-05 23:18:06', '2019-08-14T07:59:21.106Z'),
('B5571SA', 'Benedict Caldarera', 'Toyota', 'Sepeda Motor', 2014, 'Merah', '2019-06-05 23:18:06', '2019-08-14T08:03:14.222Z'),
('B6642SRY', 'Derek Janoski', 'Honda', 'Mobil', 2018, 'Hijau', '2019-06-05 23:18:06', '2019-08-14T08:00:21.749Z'),
('B6703WJF', 'Carter Rackliff', 'Honda', 'Mobil', 2015, 'Hijau', '2019-06-05 23:18:06', '2019-08-08T02:40:54.068Z'),
('B6763PSJ', 'Garret Potz', 'Honda', 'Sepeda Motor', 2017, 'Merah', '2019-06-05 23:18:06', '2019-08-14T08:00:43.156Z'),
('B6830PYW', 'Gabriel Maksymowicz', 'Toyota', 'Mobil', 2013, 'Hijau', '2019-06-05 23:18:06', '2019-08-14T08:03:02.039Z'),
('B68AR', 'Wilfredo Hrabak', 'Honda', 'Mobil', 2012, 'Hijau', '2019-06-05 23:18:06', '2019-08-14T08:01:48.429Z'),
('BG6844AAV', 'Leonel Ritthaler', 'Honda', 'Sepeda Motor', 2016, 'Merah', '2019-06-05 23:18:06', '2019-08-08T02:41:36.168Z'),
('BP1309GD', 'Aldo Doroski', 'Honda', 'Mobil', 2013, 'Silver', '2019-06-05 23:18:06', '2019-08-08T02:40:12.292Z'),
('D1024XH', 'Antione Boxleitner', 'Toyota', 'Mobil', 2015, 'Hitam', '2019-06-05 23:18:06', '2019-08-14T08:03:29.699Z'),
('D1305BLV', 'Bret Mangun', 'Toyota', 'Mobil', 2011, 'Silver', '2019-06-05 23:18:06', '2019-08-14T08:02:39.774Z'),
('D1329AHM', 'Micah Coveny', 'Toyota', 'Sepeda Motor', 2017, 'Putih', '2019-06-05 23:18:06', '2019-08-14T09:58:34.837Z'),
('D1512XW', 'Nigel Leiman', 'Toyota', 'Sepeda Motor', 2010, 'Putih', '2019-06-05 23:18:06', '2019-08-14T08:02:25.118Z'),
('D1763AGN', 'Wes Ferraioli', 'Toyota', 'Sepeda Motor', 2015, 'Biru', '2019-06-05 23:18:06', '2019-08-14T09:59:04.457Z'),
('D2294KK', 'Dominick Ramnarain', 'Toyota', 'Sepeda Motor', 2013, 'Merah', '2019-06-05 23:18:06', '2019-08-14T09:59:40.032Z'),
('D2377ABS', 'Florentino Daner', 'Toyota', 'Mobil', 2019, 'Hijau', '2019-06-05 23:18:06', '2019-08-14T09:57:51.875Z'),
('D2418VDX', 'Wesley Lytes', 'Toyota', 'Mobil', 2018, 'Hitam', '2019-06-05 23:18:06', '2019-08-14T09:58:22.377Z'),
('D3302YBA', 'Gregorio Ladeau', 'Toyota', 'Sepeda Motor', 2019, 'Merah', '2019-06-05 23:18:06', '2019-08-14T09:58:05.974Z'),
('D5161JX', 'Tyrell Fasone', 'Honda', 'Sepeda Motor', 2013, 'Biru', '2019-06-05 23:18:06', '2019-08-14T08:01:35.211Z'),
('D6080ABY', 'Stacy Hyre', 'Toyota', 'Mobil', 2014, 'Hijau', '2019-06-05 23:18:06', '2019-08-14T09:59:18.100Z'),
('D6507ZTN', 'Brenton Winge', 'Toyota', 'Mobil', 2012, 'Hitam', '2019-06-05 23:18:06', '2019-08-14T10:45:59.679Z'),
('F3017FBM', 'Monroe Patrias', 'Honda', 'Mobil', 2014, 'Silver', '2019-06-05 23:18:06', '2019-08-14T08:01:23.326Z'),
('KT5941RT', 'Werner Blasco', 'Honda', 'Sepeda Motor', 2019, 'Biru', '2019-06-05 23:18:06', '2019-08-14T08:00:00.249Z'),
('L1156JZ', 'Vernon Reik', 'Toyota', 'Mobil', 2016, 'Silver', '2019-06-05 23:18:06', '2019-08-14T09:58:49.109Z'),
('N3735CT', 'Josef Turben', 'Toyota', 'Sepeda Motor', 2016, 'Putih', '2019-06-05 23:18:06', '2019-08-14T08:03:43.223Z'),
('Z2857UJ', 'Erasmo Cowlin', 'Toyota', 'Sepeda Motor', 2018, 'Biru', '2019-06-05 23:18:06', '2019-08-14T09:57:12.566Z');

-- --------------------------------------------------------

--
-- Table structure for table `data_pelanggaran`
--

CREATE TABLE `data_pelanggaran` (
  `id` varchar(11) NOT NULL,
  `reporter_id` varchar(11) NOT NULL,
  `vehicle_id` varchar(15) DEFAULT NULL,
  `violation_type` int(11) NOT NULL,
  `detail` text NOT NULL,
  `incident_date` date NOT NULL,
  `documentation` text NOT NULL,
  `status` char(1) NOT NULL,
  `created` varchar(24) NOT NULL,
  `updated` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_pelanggaran`
--

INSERT INTO `data_pelanggaran` (`id`, `reporter_id`, `vehicle_id`, `violation_type`, `detail`, `incident_date`, `documentation`, `status`, `created`, `updated`) VALUES
('T1DI8FF5E8', 'U1DI8F8V4E', 'A1007LW', 5, 'Testing', '2019-08-10', '2019-08-14T16-30-40.537Z_aP7gm9VE_700w_0.jpg', '1', '2019-08-14T16:30:40.584Z', '2019-08-14T16:32:08.023Z');

-- --------------------------------------------------------

--
-- Table structure for table `data_point`
--

CREATE TABLE `data_point` (
  `id` int(11) NOT NULL,
  `user_id` varchar(11) NOT NULL,
  `point` text NOT NULL,
  `created` varchar(24) NOT NULL,
  `updated` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_point`
--

INSERT INTO `data_point` (`id`, `user_id`, `point`, `created`, `updated`) VALUES
(6, 'U1DI8F8V4E', '10', '2019-08-14T16:29:39.365Z', '2019-08-14T16:32:08.023Z');

-- --------------------------------------------------------

--
-- Table structure for table `data_user`
--

CREATE TABLE `data_user` (
  `id` varchar(11) NOT NULL,
  `password` text NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `citizen_id` char(16) NOT NULL,
  `captured_id` text NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `address` text,
  `status` char(1) NOT NULL,
  `created` varchar(24) NOT NULL,
  `updated` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `data_user`
--

INSERT INTO `data_user` (`id`, `password`, `name`, `email`, `phone`, `citizen_id`, `captured_id`, `gender`, `address`, `status`, `created`, `updated`) VALUES
('A1DI8A1527', '+bzBfGTMIz93h8vtAUJlpD1GQSd1UIJXim+ljUYmdwQ=', 'Admin', 'admin@gmail.com', '089678000631', '2477669718933280', '2019-08-14T14-55-38.561Z_a76jZQoo_700w_0.jpg', 'Male', 'Jl. Sukabirus No.50, Bandung', '3', '2019-08-14T14:55:38.567Z', '2019-08-14T15:36:00.347Z'),
('U1DI8F8V4E', 'k4K5meDLZZ1IUDtqeWKgCVNirqawFSqCvp0XrsTsi4U=', 'Aldi Wiranata', 'aldiw01@gmail.com', '089678000631', '2477669718933280', '2019-08-14T16-27-17.514Z_alzdprE2_700w_0.jpg', 'Male', 'Jl. Sukabirus No.50, Bandung', '2', '2019-08-14T16:27:17.518Z', '2019-08-14T16:29:39.365Z');

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `ticket_id` varchar(11) NOT NULL,
  `from_id` varchar(11) NOT NULL,
  `to_id` varchar(11) NOT NULL,
  `info` text,
  `message` text,
  `status` char(1) NOT NULL,
  `created` varchar(24) NOT NULL,
  `updated` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `ticket_id`, `from_id`, `to_id`, `info`, `message`, `status`, `created`, `updated`) VALUES
(1, '101', '7', '102', 'telah menutup status tiket anda', 'Valid ACC', '0', '2019-07-14 23:27:03', '2019-07-14 23:27:03'),
(2, '106', '106', '0', 'telah mengajukan tiket', '', '0', '2019-08-11T20:20:25.005Z', '2019-08-11T20:20:25.005Z'),
(3, '102', '7', '106', 'telah menutup status tiket anda', 'acc', '0', '2019-08-12T01:05:23.566Z', '2019-08-12T01:05:23.566Z'),
(4, '103', '7', '106', 'telah menutup status tiket anda', 'valid', '0', '2019-08-12T01:06:39.368Z', '2019-08-12T01:06:39.368Z'),
(5, '104', '7', '106', 'telah menutup status tiket anda', 'ok', '0', '2019-08-12T01:08:53.863Z', '2019-08-12T01:08:53.863Z'),
(6, '107', '0', '0', 'telah mengajukan tiket', '', '0', '2019-08-12T17:05:20.035Z', '2019-08-12T17:05:20.035Z'),
(7, 'T1DI3ESN1N', 'A1DI8A1527', 'U1DI3BI8VR', 'telah mengajukan tiket', '', '0', '2019-08-12T17:36:41.044Z', '2019-08-12T17:36:41.044Z'),
(8, 'T1DI3ESN1N', 'U1DI3BI8VR', 'A', 'telah mengajukan tiket', '', '0', '2019-08-12T17:44:23.863Z', '2019-08-12T17:44:23.863Z'),
(9, 'T1DI3ESN1N', 'A1DI8A1527', 'U1DI3BI8VR', 'telah menutup status tiket anda', 'Valid OK', '0', '2019-08-14T16:18:44.919Z', '2019-08-14T16:18:44.919Z'),
(10, 'T1DI8FF5E8', 'U1DI8F8V4E', 'A', 'telah mengajukan tiket', '', '0', '2019-08-14T16:30:40.584Z', '2019-08-14T16:30:40.584Z'),
(11, 'T1DI8FF5E8', 'A1DI8A1527', 'U1DI8F8V4E', 'telah menutup status tiket anda', 'Valid OK', '0', '2019-08-14T16:32:08.021Z', '2019-08-14T16:32:08.021Z');

-- --------------------------------------------------------

--
-- Table structure for table `reset_password`
--

CREATE TABLE `reset_password` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(32) NOT NULL,
  `expired` bigint(20) NOT NULL,
  `status` char(1) NOT NULL,
  `created` varchar(24) NOT NULL,
  `updated` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `verification_token`
--

CREATE TABLE `verification_token` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `token` varchar(32) NOT NULL,
  `status` char(1) NOT NULL,
  `created` varchar(24) NOT NULL,
  `updated` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `violation_list`
--

CREATE TABLE `violation_list` (
  `id` int(11) NOT NULL,
  `type` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `violation_list`
--

INSERT INTO `violation_list` (`id`, `type`) VALUES
(1, 'Lalu lintas'),
(2, 'Identitas Pengendara'),
(3, 'Atribut Kendaraan'),
(4, 'Atribut Berkendara'),
(5, 'Ugal-ugalan');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data_kendaraan`
--
ALTER TABLE `data_kendaraan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_pelanggaran`
--
ALTER TABLE `data_pelanggaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `violation_type` (`violation_type`),
  ADD KEY `TEST` (`reporter_id`);

--
-- Indexes for table `data_point`
--
ALTER TABLE `data_point`
  ADD PRIMARY KEY (`id`),
  ADD KEY `TEST` (`user_id`);

--
-- Indexes for table `data_user`
--
ALTER TABLE `data_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reset_password`
--
ALTER TABLE `reset_password`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `verification_token`
--
ALTER TABLE `verification_token`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `violation_list`
--
ALTER TABLE `violation_list`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data_point`
--
ALTER TABLE `data_point`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `reset_password`
--
ALTER TABLE `reset_password`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `verification_token`
--
ALTER TABLE `verification_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `violation_list`
--
ALTER TABLE `violation_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
