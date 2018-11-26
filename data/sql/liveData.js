let moored = function (idPortinformer, idCurrentActivity, mooringStates) {
    return `SELECT RES.fk_control_unit_data, ship_description, ts_main_event_field_val, quays.description, berths.description
    FROM (
        SELECT fk_control_unit_data, MAX(ts_main_event_field_val) AS max_time, fk_portinformer
        FROM trips_logs
        WHERE fk_state IN ${mooringStates}
        GROUP BY fk_control_unit_data, fk_portinformer
        ) 
    AS RES
    INNER JOIN trips_logs AS TL 
    ON RES.fk_control_unit_data = TL.fk_control_unit_data
    INNER JOIN maneuverings
    ON TL.fk_maneuvering = maneuverings.id_maneuvering
    INNER JOIN quays
    ON maneuverings.fk_stop_quay = quays.id_quay
    INNER JOIN berths
    ON maneuverings.fk_stop_berth = berths.id_berth
    INNER JOIN control_unit_data
    ON control_unit_data.id_control_unit_data = TL.fk_control_unit_data 
    INNER JOIN ships
    ON control_unit_data.fk_ship = id_ship
    AND ts_main_event_field_val = max_time
    WHERE control_unit_data.fk_portinformer = ${idPortinformer}
    AND fk_ship_current_activity = ${idCurrentActivity}
    AND is_active = true
    GROUP BY RES.fk_control_unit_data, ts_main_event_field_val, ship_description, quays.description, berths.description
    ORDER BY RES.fk_control_unit_data
`;
};  


let liveData = {
    moored: moored
};

module.exports = liveData;