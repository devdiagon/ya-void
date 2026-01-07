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

-- Area
CREATE TABLE area (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    farm_id INTEGER NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES farm(id)
);

-- Requester
CREATE TABLE requester (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- Area x Requester
CREATE TABLE area_requester (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area_id INTEGER NOT NULL,
    requester_id INTEGER NOT NULL,
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
    UNIQUE (farm_work_zone_id, area_id),
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
    route_snapshot TEXT,
    reason_snapshot TEXT,
    FOREIGN KEY (requester_id) REFERENCES requester(id),
    FOREIGN KEY (area_id) REFERENCES area(id),
    FOREIGN KEY (work_zone_sheet_id) REFERENCES work_zone_sheet(id),
    FOREIGN KEY (route_id) REFERENCES route(id),
    FOREIGN KEY (reason_id) REFERENCES reason(id)
);

-- Para búsquedas rápidas de viajes por fecha (Calendarios/Reportes)
CREATE INDEX idx_trip_date ON trip(trip_date);

-- Para filtrar viajes pendientes vs realizados
CREATE INDEX idx_trip_status ON trip(status);

-- Índices en claves foráneas con mucha actividad
CREATE INDEX idx_trip_area_id ON trip(area_id);
CREATE INDEX idx_trip_requester_id ON trip(requester_id);
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

-- Area
INSERT INTO area (id, name, farm_id) VALUES
(1, 'Empaque', 1),
(2, 'Logística', 1),
(3, 'Poscosecha', 1),
(4, 'Sublimación', 1),
(5, 'Administración', 1),
(6, 'Producción', 1),
(7, 'Riego', 1),
(8, 'Trabajo Social', 1),
(9, 'Nómina', 1),
(10, 'Talento Humano', 1),
(11, 'Bodega', 1),
(12, 'Selección', 1),

(13, 'Empaque', 2),
(14, 'Logística', 2),
(15, 'Poscosecha', 2),
(16, 'Sublimación', 2),
(17, 'Administración', 2),
(18, 'Producción', 2),
(19, 'Riego', 2),
(20, 'Talento Humano', 2),
(21, 'Trabajo Social', 2),
(22, 'Bocashi', 2),
(23, 'Sanidad Vegetal', 2),
(24, 'Selección', 2),
(25, 'Dispensario Médico', 2),

(26, 'Empaque', 3),
(27, 'Logística', 3),
(28, 'Poscosecha', 3),
(29, 'Sublimación', 3),
(30, 'Administración', 3),
(31, 'Producción', 3),
(32, 'Riego', 3),
(33, 'Talento Humano', 3),
(34, 'Trabajo Social', 3),
(35, 'Bocashi', 3),
(36, 'Sanidad Vegetal', 3),
(37, 'Selección', 3),
(38, 'Dispensario Médico', 3),

(39, 'Empaque', 4),
(40, 'Logística', 4),
(41, 'Poscosecha', 4),
(42, 'Sublimación', 4),
(43, 'Administración', 4),
(44, 'Producción', 4),
(45, 'Riego', 4),
(46, 'Trabajo Social', 4),
(47, 'Selección', 4),
(48, 'Talento Humano', 4),

(49, 'Empaque', 5),
(50, 'Logística', 5),
(51, 'Poscosecha', 5),
(52, 'Sublimación', 5),
(53, 'Administración', 5),
(54, 'Producción', 5),
(55, 'Riego', 5),
(56, 'Trabajo Social', 5),
(57, 'Talento Humano', 5),
(58, 'Selección', 5);

-- Requester
INSERT INTO requester (id, name) VALUES
(1, 'Sr. Gabriel Acuña'),
(2, 'Ing. Edgar Calderón'),
(3, 'Lcda. Ruth Díaz'),
(4, 'Lcda. Patricia Rivera'),
(5, 'Srita. Patricia Calala'),
(6, 'Lcda. Isabel Parra'),
(7, 'Ing. Mónica Quiloango'),
(8, 'Sr. Miguel Rodríguez'),
(9, 'Sr. Diego Morales'),
(10, 'Srita. Tatiana Forero'),
(11, 'Sr. Javier Cuastumal'),
(12, 'Srita. Diana Quinchiguango'),
(13, 'Lcda. Anahi Guaytarrilla'),
(14, 'Lcda. Clemencia Farinango'),
(15, 'Sra. Gabriela Toapanta'),
(16, 'Srita. Esmeralda Quilo'),
(17, 'Srita. Irene Cabascango'),
(18, 'Sr. Jhonatan Rengifo'),
(19, 'Jhon Sandoval'),
(20, 'Lcda. Mirian Noboa'),
(21, 'Lcda. Angélica Sánchez'),
(22, 'Ing. Joselyn Verdugo'),
(23, 'Sr. Eduardo Pinzón'),
(24, 'Sr. Fabian Cedeño'),
(25, 'Sr. Cristobal Burgos'),
(26, 'Lic. Gabriel Chalá'),
(27, 'Ing. Lucia Saquicela'),
(28, 'Sr. Alexis Camacho'),
(29, 'Sr. Galo Rengifo'),
(30, 'Sr. Jesus Guaña'),
(31, 'Lcda. Johana Loachamín'),
(32, 'Srita. Andrea Lara'),
(33, 'Dra. Doris Túquerres'),
(34, 'Sr. Julio Ushiña'),
(35, 'Sr. Santiago Quezada'),
(36, 'Sr. Manuel Cuascota'),
(37, 'Sr. Isaac Rivadeneira'),
(38, 'Ing. Jorge Trujillo'),
(39, 'Ing. Jorge Murillo'),
(40, 'Ing. Pamela Montenegro');

-- Area x Requester
INSERT INTO area_requester (id, area_id, requester_id) VALUES
(1,1,1),(2,2,2),(3,3,3),(4,4,3),(5,5,4),(6,6,5),(7,7,6),(8,8,7),
(9,9,8),(10,10,9),(11,11,10),(12,12,11),(13,1,12),(14,2,12),
(15,3,12),(16,5,13),(17,5,14),(18,5,15),(19,1,16),(20,3,16),

(21,13,1),(22,14,2),(23,15,3),(24,16,3),(25,17,4),(26,18,5),
(27,19,6),(28,20,22),(29,21,10),(30,22,34),(31,23,35),
(32,24,16),(33,25,17),

(34,26,1),(35,27,2),(36,28,3),(37,29,3),(38,30,4),(39,31,5),
(40,32,6),(41,33,22),(42,34,10),(43,35,34),(44,36,35),
(45,37,16),(46,38,17),

(47,39,1),(48,40,2),(49,41,3),(50,42,3),(51,43,4),(52,44,5),
(53,45,6),(54,46,6),(55,47,11),(56,48,12),

(57,49,1),(58,50,2),(59,51,3),(60,52,3),(61,53,4),(62,54,5),
(63,55,6),(64,56,36),(65,57,37),(66,58,38);
`
