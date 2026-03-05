export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

--------------------------------------------------
-- TABLES
--------------------------------------------------

-- Farm
CREATE TABLE farm (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Requester
CREATE TABLE requester (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Area
CREATE TABLE area (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    farm_id INTEGER NOT NULL,
    manager_name TEXT,
    manager_cid TEXT,
    FOREIGN KEY (farm_id) REFERENCES farm(id)
);

-- Area x Requester
CREATE TABLE area_requester (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area_id INTEGER NOT NULL,
    requester_id INTEGER,
    UNIQUE (area_id, requester_id),
    FOREIGN KEY (area_id) REFERENCES area(id),
    FOREIGN KEY (requester_id) REFERENCES requester(id)
);

-- Work Zone
CREATE TABLE work_zone (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Farm Work Zone
CREATE TABLE farm_work_zone (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    work_zone_id INTEGER NOT NULL,
    farm_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (work_zone_id) REFERENCES work_zone(id),
    FOREIGN KEY (farm_id) REFERENCES farm(id)
);

-- Work Zone Sheet
CREATE TABLE work_zone_sheet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    farm_work_zone_id INTEGER NOT NULL,
    area_id INTEGER NOT NULL,
    total_sheet REAL DEFAULT 0,
    FOREIGN KEY (farm_work_zone_id) REFERENCES farm_work_zone(id),
    FOREIGN KEY (area_id) REFERENCES area(id)
);

-- Route
CREATE TABLE route (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    area_id INTEGER NOT NULL,
    UNIQUE (name, area_id),
    FOREIGN KEY (area_id) REFERENCES area(id)
);

-- Reason
CREATE TABLE reason (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    area_id INTEGER NOT NULL,
    UNIQUE (name, area_id),
    FOREIGN KEY (area_id) REFERENCES area(id)
);

-- Subarea
CREATE TABLE subarea (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    area_id INTEGER NOT NULL,
    UNIQUE (name, area_id),
    FOREIGN KEY (area_id) REFERENCES area(id)
);

-- Trip
CREATE TABLE trip (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_type TEXT CHECK (vehicle_type IN ('Camioneta', 'Furgoneta', 'Microbus', 'Bus')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready')),
    trip_date DATE,
    departure_time TIME,
    arrival_time TIME,
    passenger_count INTEGER CHECK (passenger_count >= 0),
    cost REAL CHECK (cost >= 0),
    requester_id INTEGER,
    area_id INTEGER,
    work_zone_sheet_id INTEGER,
    route_id INTEGER,
    reason_id INTEGER,
    subarea_id INTEGER,
    route_snapshot TEXT,
    reason_snapshot TEXT,
    subarea_snapshot TEXT,
    FOREIGN KEY (requester_id) REFERENCES requester(id),
    FOREIGN KEY (area_id) REFERENCES area(id),
    FOREIGN KEY (work_zone_sheet_id) REFERENCES work_zone_sheet(id),
    FOREIGN KEY (route_id) REFERENCES route(id),
    FOREIGN KEY (reason_id) REFERENCES reason(id),
    FOREIGN KEY (subarea_id) REFERENCES subarea(id)
);

-- Para búsquedas rápidas de viajes por fecha (Calendarios/Reportes)
CREATE INDEX idx_trip_date ON trip(trip_date);

-- Para filtrar viajes pendientes vs realizados
CREATE INDEX idx_trip_status ON trip(status);

-- Índices en claves foráneas con mucha actividad
CREATE INDEX idx_trip_area_id ON trip(area_id);
CREATE INDEX idx_trip_requester_id ON trip(requester_id);
CREATE INDEX idx_trip_subarea_id ON trip(subarea_id);
CREATE INDEX idx_area_farm_id ON area(farm_id);
CREATE INDEX idx_work_zone_dates ON work_zone(start_date, end_date);


--------------------------------------------------
-- DATA
--------------------------------------------------

-- Farm
INSERT INTO farm (id, name) VALUES
(1, 'Rosaprima 1'),
(2, 'Rosaprima 2'),
(3, 'Rosaprima 3'),
(4, 'Rosaprima 4'),
(5, 'Rosaprima 6');

-- Requester
INSERT INTO requester (id, name) VALUES
(1,'Calderon Edgar Ivan'),
(2,'Quiloango Tipanluisa Monica Lorena'),
(3,'Diaz Toapanta Ruth Elisabeth'),
(4,'Murillo Redin Jorge Eduardo'),
(5,'Quinchiguango Morales Bethy Carolina'),
(6,'Saquicela Coronel Laura Lucia'),
(7,'Gualavisi Morales Angelica Marina'),
(8,'Cuascota Erazo Manuel Mesias'),
(9,'Parra Meza Carmen Isabel'),
(10,'Forero Vargas Jennifer Tatiana'),
(11,'Cabascango Cuascota Irene Margoth'),
(12,'Rengifo Quimbiamba Jhonatan Antonio'),
(13,'Sandoval Andrango Jhon Jairo'),
(14,'Verdugo Herrera Joselyn Margoth'),
(15,'Loachamin Changoluisa Johana Magali'),
(16,'Lara Soto Andrea Stefania'),
(17,'Tuquerres Chicaiza Doris Consuelo'),
(18,'Quilo Catucuamba Jenny Esmeralda'),
(19,'Ulloa Padilla Luis Medardo'),
(20,'Trujillo Chuga Jorge Farit'),
(21,'Morales Escobar Diego Esteban'),
(22,'Rodriguez Jarrin Carlos Omar'),
(23,'Camacho Andrango Alexis Xavier'),
(24,'Chala Pabon Angel Gabriel'),
(25,'Saavedra Herrera Maria Lizeth'),
(26,'Quinchiguango Tallana Diana Del Pilar'),
(27,'Guaytarilla Pinto Angie Anahi');

-- Area
INSERT INTO area (id, name, farm_id, manager_name, manager_cid) VALUES
(1,'Empaque',1,'Calderon Edgar Ivan','1309111472'),
(2,'Logística',1,'Quiloango Tipanluisa Monica Lorena','1717580177'),
(3,'Poscosecha',1,'Calderon Edgar Ivan','1309111472'),
(5,'Administración',1,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(6,'Producción',1,'Murillo Redin Jorge Eduardo','1710203678'),
(8,'Trabajo Social',1,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(9,'Nómina',1,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(10,'Talento Humano',1,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(12,'Selección',1,'Diaz Toapanta Ruth Elisabeth','1711008431'),

(13,'Empaque',2,'Quinchiguango Morales Bethy Carolina','1003565478'),
(14,'Logística',2,'Quiloango Tipanluisa Monica Lorena','1717580177'),
(15,'Poscosecha',2,'Quinchiguango Morales Bethy Carolina','1003565478'),
(17,'Administración',2,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(18,'Producción',2,'Murillo Redin Jorge Eduardo','1710203678'),
(20,'Talento Humano',2,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(21,'Trabajo Social',2,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(24,'Selección',2,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(25,'Dispensario Médico',2,'Diaz Toapanta Ruth Elisabeth','1711008431'),

(26,'Empaque',3,'Saquicela Coronel Laura Lucia','1400995625'),
(27,'Logística',3,'Quiloango Tipanluisa Monica Lorena','1717580177'),
(28,'Poscosecha',3,'Saquicela Coronel Laura Lucia','1400995625'),
(30,'Administración',3,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(31,'Producción',3,'Murillo Redin Jorge Eduardo','1710203678'),
(33,'Talento Humano',3,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(34,'Trabajo Social',3,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(37,'Selección',3,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(38,'Dispensario Médico',3,'Diaz Toapanta Ruth Elisabeth','1711008431'),

(39,'Empaque',4,'Gualavisi Morales Angelica Marina','1718240094'),
(40,'Logística',4,'Quiloango Tipanluisa Monica Lorena','1717580177'),
(41,'Poscosecha',4,'Gualavisi Morales Angelica Marina','1718240094'),
(43,'Administración',4,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(44,'Producción',4,'Murillo Redin Jorge Eduardo','1710203678'),
(46,'Trabajo Social',4,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(47,'Selección',4,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(48,'Talento Humano',4,'Diaz Toapanta Ruth Elisabeth','1711008431'),

(49,'Empaque',5,'Cuascota Erazo Manuel Mesias','1005358864'),
(50,'Logística',5,'Quiloango Tipanluisa Monica Lorena','1717580177'),
(51,'Poscosecha',5,'Cuascota Erazo Manuel Mesias','1005358864'),
(53,'Administración',5,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(54,'Producción',5,'Murillo Redin Jorge Eduardo','1710203678'),
(56,'Trabajo Social',5,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(57,'Talento Humano',5,'Diaz Toapanta Ruth Elisabeth','1711008431'),
(58,'Selección',5,'Diaz Toapanta Ruth Elisabeth','1711008431');


-- Subarea
INSERT INTO subarea (id, name, area_id) VALUES
(1,'Empaque',1),
(2,'Logística',2),
(3,'Poscosecha',3),
(5,'Administración',5),
(6,'Producción',6),
(8,'Trabajo Social',8),
(9,'Nómina',9),
(10,'Talento Humano',10),
(12,'Selección',12),
(13,'Empaque',13),
(14,'Logística',14),
(15,'Poscosecha',15),
(17,'Administración',17),
(18,'Producción',18),
(20,'Talento Humano',20),
(21,'Trabajo Social',21),
(24,'Selección',24),
(25,'Dispensario Médico',25),
(26,'Empaque',26),
(27,'Logística',27),
(28,'Poscosecha',28),
(30,'Administración',30),
(31,'Producción',31),
(33,'Talento Humano',33),
(34,'Trabajo Social',34),
(37,'Selección',37),
(38,'Dispensario Médico',38),
(39,'Empaque',39),
(40,'Logística',40),
(41,'Poscosecha',41),
(43,'Administración',43),
(44,'Producción',44),
(46,'Trabajo Social',46),
(47,'Selección',47),
(48,'Talento Humano',48),
(49,'Empaque',49),
(50,'Logística',50),
(51,'Poscosecha',51),
(53,'Administración',53),
(54,'Producción',54),
(56,'Trabajo Social',56),
(57,'Talento Humano',57),
(58,'Selección',58);


-- Area x Requester
INSERT INTO area_requester (id, area_id, requester_id) VALUES
(1,5,9),
(2,5,10),
(3,25,11),
(4,47,17),
(5,37,18),
(6,48,26),
(7,46,25),
(8,47,23),
(9,47,24),
(10,41,21),
(11,40,22),
(12,44,4),
(13,43,3),
(14,26,6),
(15,39,7),
(16,1,1),
(17,2,2),
(18,3,1),
(19,5,3),
(20,6,4),
(21,8,3),
(22,9,3),
(23,10,3),
(24,12,3),
(25,13,5),
(26,14,2),
(27,15,5),
(28,17,3),
(29,18,4),
(30,20,3),
(31,21,3),
(32,24,3),
(33,25,3),
(34,27,2),
(35,28,6),
(36,30,3),
(37,31,4),
(38,33,3),
(39,34,3),
(40,37,3),
(41,38,3),
(42,40,2),
(43,41,7),
(44,46,3),
(45,47,3),
(46,48,3),
(47,49,8),
(48,50,2),
(49,51,8),
(50,53,3),
(51,54,4),
(52,56,3),
(53,57,3),
(54,58,3);

`
