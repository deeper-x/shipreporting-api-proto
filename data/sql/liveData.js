'use strict';

let moored = function (idPortinformer, idCurrentActivity, notOperationalStates) {
    return `SELECT RES.fk_control_unit_data as id_trip, ship_description as ship, 
    ts_main_event_field_val, quays.description as quay, berths.description as berth, 
    type_acronym as ship_type, iso3, gross_tonnage, ships.length, ships.width,
    ports.name as port, agencies.description as agency, shipped_goods_data
    FROM (  
        SELECT fk_control_unit_data, MAX(ts_main_event_field_val) AS max_time, fk_portinformer
        FROM trips_logs
        WHERE fk_state IN ${notOperationalStates}
        GROUP BY fk_control_unit_data, fk_portinformer
        ) 
    AS RES
    INNER JOIN trips_logs AS TL 
    ON RES.fk_control_unit_data = TL.fk_control_unit_data
    INNER JOIN agencies
    ON TL.fk_agency = agencies.id_agency
    INNER JOIN maneuverings
    ON TL.fk_maneuvering = maneuverings.id_maneuvering
    INNER JOIN quays
    ON maneuverings.fk_stop_quay = quays.id_quay
    INNER JOIN berths
    ON maneuverings.fk_stop_berth = berths.id_berth
    INNER JOIN control_unit_data
    ON control_unit_data.id_control_unit_data = TL.fk_control_unit_data
    INNER JOIN shipping_details
    ON shipping_details.id_shipping_details = control_unit_data.fk_shipping_details
    INNER JOIN (
        SELECT fk_control_unit_data, string_agg(goods_mvmnt_type||'->'||goods_categories.description::TEXT||'-'||groups_categories.description, ', ') AS shipped_goods_row
        FROM shipped_goods
        INNER JOIN goods_categories
        ON goods_categories.id_goods_category = shipped_goods.fk_goods_category
        INNER JOIN groups_categories
        ON groups_categories.id_group = goods_categories.fk_group_category
        GROUP BY fk_control_unit_data        
    ) as shipped_goods_data
    ON shipped_goods_data.fk_control_unit_data = control_unit_data.id_control_unit_data
    INNER JOIN ports
    ON shipping_details.fk_port_provenance = ports.id_port 
    INNER JOIN ships
    ON control_unit_data.fk_ship = id_ship
    INNER JOIN ship_types
    ON ships.fk_ship_type = ship_types.id_ship_type
    INNER JOIN countries
    ON countries.id_country = ships.fk_country_flag 
    AND ts_main_event_field_val = max_time
    WHERE control_unit_data.fk_portinformer = ${idPortinformer}
    AND fk_ship_current_activity = ${idCurrentActivity}
    AND is_active = true
    GROUP BY id_trip, ts_main_event_field_val, ship, 
    quay, berth, ship_type, iso3, gross_tonnage, ships.length, 
    ships.width, port, agency, shipped_goods_data
    ORDER BY RES.fk_control_unit_data`;
};  

let roadstead = function (idPortinformer, idCurrentActivity, notOperationalStates) {
    return `SELECT RES.fk_control_unit_data, ship_description, 
    ts_main_event_field_val, anchorage_points.description
    FROM (
        SELECT fk_control_unit_data, MAX(ts_main_event_field_val) AS max_time, fk_portinformer
        FROM trips_logs
        WHERE fk_state NOT IN ${notOperationalStates}
        GROUP BY fk_control_unit_data, fk_portinformer
        ) 
    AS RES
    INNER JOIN trips_logs AS TL 
    ON RES.fk_control_unit_data = TL.fk_control_unit_data
    INNER JOIN maneuverings
    ON TL.fk_maneuvering = maneuverings.id_maneuvering
    INNER JOIN anchorage_points
    ON maneuverings.fk_stop_anchorage_point = anchorage_points.id_anchorage_point
    INNER JOIN control_unit_data
    ON control_unit_data.id_control_unit_data = TL.fk_control_unit_data 
    INNER JOIN ships
    ON control_unit_data.fk_ship = id_ship
    AND ts_main_event_field_val = max_time
    WHERE control_unit_data.fk_portinformer = ${idPortinformer}
    AND fk_ship_current_activity = ${idCurrentActivity}
    AND is_active = true
    GROUP BY RES.fk_control_unit_data, ts_main_event_field_val, 
    ship_description, anchorage_points.description
    ORDER BY RES.fk_control_unit_data`;
};

let arrivals = function (idPortinformer) {
    return `SELECT id_control_unit_data AS id_trip, 
    ship_description AS ship_name,  
    ts_avvistamento AS sighting_time
    FROM data_avvistamento_nave
    INNER JOIN control_unit_data
    ON data_avvistamento_nave.fk_control_unit_data = id_control_unit_data
    INNER JOIN ships
    ON fk_ship = id_ship
    WHERE control_unit_data.fk_portinformer = ${idPortinformer}
    AND LENGTH(ts_avvistamento) > 0
    AND ts_avvistamento::DATE = current_date`;
};

let departures = function (idPortinformer) {
    return `SELECT id_control_unit_data AS id_trip, 
    ship_description AS ship_name,  
    ts_out_of_sight
    FROM data_fuori_dal_porto
    INNER JOIN control_unit_data
    ON data_fuori_dal_porto.fk_control_unit_data = id_control_unit_data
    INNER JOIN ships
    ON fk_ship = id_ship
    WHERE control_unit_data.fk_portinformer = ${idPortinformer}
    AND LENGTH(ts_out_of_sight) > 4
    AND ts_out_of_sight::DATE = current_date`;
};

let arrivalPrevisions = function (idPortinformer) {
    return `SELECT id_planned_arrival, 
    ship_description AS ship_name,  
    ts_arrival_prevision
    FROM planned_arrivals
    INNER JOIN ships
    ON fk_ship = id_ship
    WHERE planned_arrivals.fk_portinformer = ${idPortinformer}
    AND LENGTH(ts_arrival_prevision) > 4
    AND ts_arrival_prevision::DATE = current_date`;
};


let liveData = {
    moored: moored,
    roadstead: roadstead,
    arrivals: arrivals,
    departures: departures,
    arrivalPrevisions: arrivalPrevisions
};

module.exports = liveData;