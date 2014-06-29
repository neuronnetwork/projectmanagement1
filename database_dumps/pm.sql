-- phpMyAdmin SQL Dump
-- version 4.2.3
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 29. Jun 2014 um 14:10
-- Server Version: 5.5.37-MariaDB-wsrep
-- PHP-Version: 5.5.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `pm`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `etherpads`
--

CREATE TABLE IF NOT EXISTS `etherpads` (
  `uid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `project_uid` int(11) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `created` bigint(20) NOT NULL,
  `user_uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `etherpads`
--

INSERT INTO `etherpads` (`uid`, `name`, `project_uid`, `deleted`, `created`, `user_uid`) VALUES
(4, 'topics', 3, 0, 1393023359532, -1),
(5, 'protocol', 3, 0, 1393023359533, -1),
(8, 'topics', 7, 0, 1392668364000, 5),
(9, 'protocol', 7, 0, 1392668364000, 5);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
  `uid` int(11) NOT NULL,
  `project_title` varchar(50) NOT NULL,
  `user_uid` int(11) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `created` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `projects`
--

INSERT INTO `projects` (`uid`, `project_title`, `user_uid`, `deleted`, `created`) VALUES
(3, 'test2', -1, 0, 1393023359532),
(7, 'trest', 5, 0, 1392668364000);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todofilegroup`
--

CREATE TABLE IF NOT EXISTS `todofilegroup` (
  `uid` int(11) NOT NULL,
  `description` varchar(300) NOT NULL,
  `todo_uid` int(11) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `created` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `todofilegroup`
--

INSERT INTO `todofilegroup` (`uid`, `description`, `todo_uid`, `deleted`, `created`) VALUES
(55, 'schalal', 50, 0, 1393099896452),
(58, 'test', 49, 0, 1393180471570),
(59, 'ad', 35, 0, 1393181388058),
(60, 'asd', 51, 0, 1393181531053),
(84, 'SEPA Formulare Kapfer', 35, 0, 1393188084346),
(93, 'Test2', 35, 0, 1393188255896),
(105, 'kapfer', 103, 0, 1393188469854),
(114, 'sf', 113, 0, 1393188630472),
(118, 'sdf', 113, 0, 1393188694593),
(119, 'dsgd', 40, 0, 1393190049002),
(126, 'sdf', 51, 0, 1393190143565),
(134, 'asd', 133, 0, 1393190229814),
(138, 'sfd', 133, 0, 1393190354437),
(150, 'fghfgh', 39, 0, 1393192640213);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todofiles`
--

CREATE TABLE IF NOT EXISTS `todofiles` (
  `uid` int(11) NOT NULL,
  `filename` varchar(600) NOT NULL,
  `filegroup_uid` int(11) NOT NULL,
  `filelocation` varchar(800) NOT NULL,
  `created` bigint(20) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `user_uid` int(11) NOT NULL,
  `project_uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `todofiles`
--

INSERT INTO `todofiles` (`uid`, `filename`, `filegroup_uid`, `filelocation`, `created`, `deleted`, `user_uid`, `project_uid`) VALUES
(63, '5621-1ddepwm.txt', 60, '/home/georg/stoff/intranet/monitor/client/download/dev/5621-1ddepwm.txt', 1393182837120, 0, -1, 0),
(64, '5629-12ta2ui.txt', 60, '/home/georg/stoff/intranet/monitor/client/download/dev/5629-12ta2ui.txt', 1393182841790, 0, -1, 0),
(65, '5636-3ir14r.txt', 60, '/home/georg/stoff/intranet/monitor/client/download/dev/5636-3ir14r.txt', 1393182860292, 0, -1, 0),
(67, '5690-14cazcv.txt', 60, '/home/georg/stoff/intranet/monitor/client/download/dev/5690-14cazcv.txt', 1393182982530, 0, -1, 0),
(68, '5732-odbog8.html', 60, '/home/georg/stoff/intranet/monitor/client/download/dev/5732-odbog8.html', 1393183109056, 0, -1, 0),
(69, '5747-lhuspq.txt', 60, '/home/georg/stoff/intranet/monitor/client/download/dev/5747-lhuspq.txt', 1393183130509, 0, -1, 0),
(70, '5747-bphklo.txt', 57, '/home/georg/stoff/intranet/monitor/client/download/dev/5747-bphklo.txt', 1393183275859, 0, -1, 0),
(71, 'codesicherung.txt', 57, '/home/georg/stoff/intranet/monitor/client/download/dev/6277-3ad1hc.txt', 1393184549291, 0, -1, 0),
(72, 'Multiple Select Drop-Down List using AngularJS.html', 59, '/home/georg/stoff/intranet/monitor/client/download/dev/6646-7p380d.html', 1393185283785, 0, -1, 0),
(73, 'codesicherung.txt', 7, '/home/georg/stoff/intranet/monitor/client/download/dev/7352-dh0pic.txt', 1393186453716, 0, -1, 0),
(74, 'codesicherung.txt', 0, '/home/georg/stoff/intranet/monitor/client/download/dev/7668-1go1dbf.txt', 1393186560443, 0, -1, 7),
(75, 'codesicherung.txt', 0, '/home/georg/stoff/intranet/monitor/client/download/dev/7668-1q9pc7t.txt', 1393186701832, 0, -1, 3),
(76, 'codesicherung.txt', 0, '/home/georg/stoff/intranet/monitor/client/download/dev/7668-nef8q8.txt', 1393186717438, 0, -1, 3),
(77, 'codesicherung.txt', 0, '/home/georg/stoff/intranet/monitor/client/download/dev/7668-7eurom.txt', 1393187074047, 0, -1, 3),
(78, 'Multiple Select Drop-Down List using AngularJS.html', 0, '/home/georg/stoff/intranet/monitor/client/download/dev/7668-y42qyb.html', 1393187074047, 0, -1, 3),
(79, 'project_plan2.html', 0, '/home/georg/stoff/intranet/monitor/client/download/dev/7668-4goz20.html', 1393187074050, 0, -1, 3),
(80, 'project_plan2.html', 59, '/home/georg/stoff/intranet/monitor/client/download/dev/7668-p6ux0n.html', 1393187213958, 0, -1, 0),
(81, 'project_plan2.html', 59, '/home/georg/stoff/intranet/monitor/client/download/dev/7668-8niqof.html', 1393187216715, 0, -1, 0),
(82, 'project_plan2.html', 59, '/home/georg/stoff/intranet/monitor/client/download/dev/7668-mwbza9.html', 1393187219572, 0, -1, 0),
(89, 'codesicherung.txt', 84, '/home/georg/stoff/intranet/monitor/client/download/dev/8418-1wfwpzv.txt', 1393188232228, 0, -1, 0),
(90, 'codesicherung.txt', 84, '/home/georg/stoff/intranet/monitor/client/download/dev/8418-1gakg38.txt', 1393188240834, 0, -1, 0),
(91, 'Multiple Select Drop-Down List using AngularJS.html', 84, '/home/georg/stoff/intranet/monitor/client/download/dev/8418-1ibrotx.html', 1393188240835, 0, -1, 0),
(92, 'project_plan2.html', 84, '/home/georg/stoff/intranet/monitor/client/download/dev/8418-x7h6d.html', 1393188240836, 0, -1, 0),
(97, 'codesicherung.txt', 93, '/home/georg/stoff/intranet/monitor/client/download/dev/8418-1xita56.txt', 1393188283871, 0, -1, 0),
(98, 'Multiple Select Drop-Down List using AngularJS.html', 93, '/home/georg/stoff/intranet/monitor/client/download/dev/8418-2dkata.html', 1393188283874, 0, -1, 0),
(99, 'project_plan2.html', 93, '/home/georg/stoff/intranet/monitor/client/download/dev/8418-2lgjdj.html', 1393188283875, 0, -1, 0),
(100, 'codesicherung.txt', 0, '/home/georg/stoff/intranet/monitor/client/download/dev/8418-1p8phyv.txt', 1393188368524, 0, -1, 3),
(101, 'Multiple Select Drop-Down List using AngularJS.html', 0, '/home/georg/stoff/intranet/monitor/client/download/dev/8418-ux10px.html', 1393188368524, 0, -1, 3),
(102, 'project_plan2.html', 0, '/home/georg/stoff/intranet/monitor/client/download/dev/8418-s2m15g.html', 1393188368525, 0, -1, 3),
(106, 'Multiple Select Drop-Down List using AngularJS.html', 104, '/home/georg/stoff/intranet/monitor/client/download/dev/8627-1osp9ds.html', 1393188487293, 0, -1, 0),
(107, 'codesicherung.txt', 104, '/home/georg/stoff/intranet/monitor/client/download/dev/8627-vxl8ni.txt', 1393188487294, 0, -1, 0),
(108, 'project_plan2.html', 104, '/home/georg/stoff/intranet/monitor/client/download/dev/8627-1luhlzb.html', 1393188487294, 0, -1, 0),
(109, 'codesicherung.txt', 105, '/home/georg/stoff/intranet/monitor/client/download/dev/8627-1hzgjme.txt', 1393188490099, 0, -1, 0),
(110, 'Multiple Select Drop-Down List using AngularJS.html', 105, '/home/georg/stoff/intranet/monitor/client/download/dev/8627-1jwfyp7.html', 1393188490100, 0, -1, 0),
(111, 'project_plan2.html', 105, '/home/georg/stoff/intranet/monitor/client/download/dev/8627-1b2mqw4.html', 1393188490102, 0, -1, 0),
(115, 'codesicherung.txt', 114, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/9003-c6nfnu.txt', 1393188689308, 0, 1, 0),
(116, 'Multiple Select Drop-Down List using AngularJS.html', 114, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/9003-1pn5oj0.html', 1393188689309, 0, 1, 0),
(117, 'project_plan2.html', 114, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/9003-1y1vmyl.html', 1393188689309, 0, 1, 0),
(123, 'codesicherung.txt', 118, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10205-1ebzl3f.txt', 1393190132750, 0, 1, 0),
(124, 'Multiple Select Drop-Down List using AngularJS.html', 118, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10205-1a7wuk0.html', 1393190132754, 0, 1, 0),
(125, 'project_plan2.html', 118, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10205-qkhsbd.html', 1393190132752, 0, 1, 0),
(130, 'codesicherung.txt', 126, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10205-1epjyy1.txt', 1393190160345, 0, 1, 0),
(131, 'Multiple Select Drop-Down List using AngularJS.html', 126, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10205-1p0hht8.html', 1393190160347, 0, 1, 0),
(132, 'project_plan2.html', 126, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10205-9zy8s4.html', 1393190160348, 0, 1, 0),
(135, 'project_plan2.html', 134, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10733-1c9legt.html', 1393190350115, 0, 1, 0),
(136, 'Multiple Select Drop-Down List using AngularJS.html', 134, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10733-nxvddd.html', 1393190350118, 0, 1, 0),
(137, 'codesicherung.txt', 134, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10733-wtdx6b.txt', 1393190350119, 0, 1, 0),
(142, 'project_plan2.html', 138, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10733-eq75na.html', 1393190369688, 0, 1, 0),
(143, 'Multiple Select Drop-Down List using AngularJS.html', 138, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10733-1s3cm0p.html', 1393190369688, 0, 1, 0),
(144, 'codesicherung.txt', 138, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/10733-elh2ql.txt', 1393190369689, 0, 1, 0),
(145, 'Multiple Select Drop-Down List using AngularJS.html', 0, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/11601-18bgxjr.html', 1393192408761, 0, 1, 3),
(146, 'Multiple Select Drop-Down List using AngularJS.html', 0, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/11601-1eejjdq.html', 1393192410155, 0, 1, 3),
(147, 'Multiple Select Drop-Down List using AngularJS.html', 58, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/11601-dnj0eh.html', 1393192421709, 0, 1, 0),
(148, 'Multiple Select Drop-Down List using AngularJS.html', 58, '/home/georg/stoff/intranet/monitor/client/download/gschinnerl/11902-pqg13r.html', 1393192575959, 0, 1, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todolink`
--

CREATE TABLE IF NOT EXISTS `todolink` (
  `uid` int(11) NOT NULL,
  `linkname` varchar(500) NOT NULL,
  `url` varchar(500) NOT NULL,
  `todo_uid` int(11) NOT NULL,
  `created` bigint(20) NOT NULL,
  `deleted` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `todolink`
--

INSERT INTO `todolink` (`uid`, `linkname`, `url`, `todo_uid`, `created`, `deleted`) VALUES
(45, 'sdlgkf', 'www.google.at', 36, 1393099184794, 0),
(46, 'gog', 'http://www,google.at', 37, 1393099397636, 0),
(47, 'lokal', 'file:///home/georg/stoff/intranet/poc/diagramm/', 37, 1393099418126, 0),
(48, 'g', 'http://www.google.at', 37, 1393099446528, 0),
(54, 'google', 'http://www.google.at', 50, 1393099875553, 0),
(83, 'google', 'http://www.google.at', 35, 1393187962782, 0),
(149, 'sdf', '/home/georg', 50, 1393192599678, 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todos`
--

CREATE TABLE IF NOT EXISTS `todos` (
  `uid` int(11) NOT NULL,
  `todo` varchar(500) NOT NULL,
  `user_uid` int(11) NOT NULL,
  `created` bigint(20) NOT NULL,
  `deleted` tinyint(1) NOT NULL,
  `comment` text NOT NULL,
  `project_uid` int(11) NOT NULL,
  `start` varchar(300) NOT NULL,
  `end` varchar(300) NOT NULL,
  `type` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `todos`
--

INSERT INTO `todos` (`uid`, `todo`, `user_uid`, `created`, `deleted`, `comment`, `project_uid`, `start`, `end`, `type`, `status`) VALUES
(34, 'asdads', 1, 1393096936734, 0, '', 3, '', '', '', 'open'),
(35, 'sdfsdfs', 1, 1393097023758, 0, 'halloo "todo sdfsdfs"\n\nsfsdf\nfdsdf sd ds\nf sdf dsf sdfds\n df ds f', 3, '', '', '', 'open'),
(36, 'fh', 1, 1393097135255, 0, '', 3, '', '', '', 'open'),
(37, 'fhsad', 1, 1393097178008, 0, '', 3, '', '', '', 'open'),
(38, 'fhsad', 1, 1393097208581, 0, '', 3, '', '', '', 'open'),
(39, 'gerg', 1, 1393097221454, 0, 'uz gerg', 3, '', '', '', 'done'),
(40, 'gergeg', 1, 1393097272564, 0, '', 3, '2014-02-27T23:00:00.000Z', '', 'todo', 'open'),
(42, 'sdf', 1, 1393097849413, 0, '', 3, '', '', 'todo', 'open'),
(49, 'dgd', -1, 1393099621723, 0, '', 3, '', '', 'todo', 'open'),
(50, 'dfg', -1, 1393099701057, 0, '', 3, '', '', 'todo', 'open'),
(51, 'asd', -1, 1393099749395, 0, 'dsf\nhallo\nsf\ns\nf\nsdf dsf sdf \nds', 7, '', '', 'todo', 'open'),
(52, 'adsfsafd', -1, 1393099816191, 0, '', 7, '', '', 'todo', 'open'),
(53, 'sdf', -1, 1393099818223, 0, '', 7, '', '', 'todo', 'open'),
(103, 'fsdf', 1, 1393188457874, 0, '', 3, '', '', 'todo', 'open'),
(112, 'schalala', -1, 1393188505948, 0, '', 3, '', '', 'todo', 'open'),
(113, 'sfd', 1, 1393188626734, 0, '', 3, '', '', 'todo', 'open'),
(133, 'asd', 1, 1393190217898, 0, '', 7, '', '', 'todo', 'open');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `unique_id`
--

CREATE TABLE IF NOT EXISTS `unique_id` (
`id` int(11) NOT NULL,
  `tablename` varchar(50) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=152 ;

--
-- Daten für Tabelle `unique_id`
--

INSERT INTO `unique_id` (`id`, `tablename`) VALUES
(1, 'user'),
(2, 'user'),
(3, 'projects'),
(4, 'etherpads'),
(5, 'etherpads'),
(6, 'filegroup'),
(7, 'todofilegroup'),
(8, 'todofilegroup'),
(9, 'todofilegroup'),
(10, 'todofilegroup'),
(11, 'todos'),
(12, 'todofilegroup'),
(13, 'todofilegroup'),
(14, 'todofilegroup'),
(15, 'todofilegroup'),
(16, 'todofilegroup'),
(17, 'todofilegroup'),
(18, 'todofilegroup'),
(19, 'todofilegroup'),
(20, 'todos'),
(21, 'todos'),
(22, 'todos'),
(23, 'todos'),
(24, 'todos'),
(25, 'todos'),
(26, 'todos'),
(27, 'todos'),
(28, 'todos'),
(29, 'todos'),
(30, 'todos'),
(31, 'todos'),
(32, 'todos'),
(33, 'todos'),
(34, 'todos'),
(35, 'todos'),
(36, 'todos'),
(37, 'todos'),
(38, 'todos'),
(39, 'todos'),
(40, 'todos'),
(41, 'todos'),
(42, 'todos'),
(43, 'user'),
(44, 'todolink'),
(45, 'todolink'),
(46, 'todolink'),
(47, 'todolink'),
(48, 'todolink'),
(49, 'todos'),
(50, 'todos'),
(51, 'todos'),
(52, 'todos'),
(53, 'todos'),
(54, 'todolink'),
(55, 'todofilegroup'),
(56, 'todofilegroup'),
(57, 'todofilegroup'),
(58, 'todofilegroup'),
(59, 'todofilegroup'),
(60, 'todofilegroup'),
(61, 'todofiles'),
(62, 'todofiles'),
(63, 'todofiles'),
(64, 'todofiles'),
(65, 'todofiles'),
(66, 'todofiles'),
(67, 'todofiles'),
(68, 'todofiles'),
(69, 'todofiles'),
(70, 'todofiles'),
(71, 'todofiles'),
(72, 'todofiles'),
(73, 'todofiles'),
(74, 'todofiles'),
(75, 'todofiles'),
(76, 'todofiles'),
(77, 'todofiles'),
(78, 'todofiles'),
(79, 'todofiles'),
(80, 'todofiles'),
(81, 'todofiles'),
(82, 'todofiles'),
(83, 'todolink'),
(84, 'todofilegroup'),
(85, 'todofiles'),
(86, 'todofiles'),
(87, 'todofiles'),
(88, 'todofiles'),
(89, 'todofiles'),
(90, 'todofiles'),
(91, 'todofiles'),
(92, 'todofiles'),
(93, 'todofilegroup'),
(94, 'todofiles'),
(95, 'todofiles'),
(96, 'todofiles'),
(97, 'todofiles'),
(98, 'todofiles'),
(99, 'todofiles'),
(100, 'todofiles'),
(101, 'todofiles'),
(102, 'todofiles'),
(103, 'todos'),
(104, 'todofilegroup'),
(105, 'todofilegroup'),
(106, 'todofiles'),
(107, 'todofiles'),
(108, 'todofiles'),
(109, 'todofiles'),
(110, 'todofiles'),
(111, 'todofiles'),
(112, 'todos'),
(113, 'todos'),
(114, 'todofilegroup'),
(115, 'todofiles'),
(116, 'todofiles'),
(117, 'todofiles'),
(118, 'todofilegroup'),
(119, 'todofilegroup'),
(120, 'todofiles'),
(121, 'todofiles'),
(122, 'todofiles'),
(123, 'todofiles'),
(124, 'todofiles'),
(125, 'todofiles'),
(126, 'todofilegroup'),
(127, 'todofiles'),
(128, 'todofiles'),
(129, 'todofiles'),
(130, 'todofiles'),
(131, 'todofiles'),
(132, 'todofiles'),
(133, 'todos'),
(134, 'todofilegroup'),
(135, 'todofiles'),
(136, 'todofiles'),
(137, 'todofiles'),
(138, 'todofilegroup'),
(139, 'todofiles'),
(140, 'todofiles'),
(141, 'todofiles'),
(142, 'todofiles'),
(143, 'todofiles'),
(144, 'todofiles'),
(145, 'todofiles'),
(146, 'todofiles'),
(147, 'todofiles'),
(148, 'todofiles'),
(149, 'todolink'),
(150, 'todofilegroup'),
(151, 'todofiles');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `color` varchar(40) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(500) NOT NULL,
  `admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `firstname`, `lastname`, `color`, `username`, `password`, `admin`) VALUES
(1, 'admin', 'admin', '', 'admin', 'admin', 1),
(43, 'dev', 'dev', '', 'dev', 'dev', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `etherpads`
--
ALTER TABLE `etherpads`
 ADD PRIMARY KEY (`uid`,`project_uid`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
 ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `todofilegroup`
--
ALTER TABLE `todofilegroup`
 ADD UNIQUE KEY `uid` (`uid`);

--
-- Indexes for table `todofiles`
--
ALTER TABLE `todofiles`
 ADD UNIQUE KEY `uid` (`uid`);

--
-- Indexes for table `todolink`
--
ALTER TABLE `todolink`
 ADD UNIQUE KEY `uid` (`uid`);

--
-- Indexes for table `todos`
--
ALTER TABLE `todos`
 ADD UNIQUE KEY `uid` (`uid`);

--
-- Indexes for table `unique_id`
--
ALTER TABLE `unique_id`
 ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
 ADD UNIQUE KEY `uid_2` (`id`), ADD KEY `uid` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `unique_id`
--
ALTER TABLE `unique_id`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=152;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
