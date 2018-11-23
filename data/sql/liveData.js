let moored = function (idPortinformer, idCurrentActivity, moorintStates) {
    return `SELECT RES.fk_control_unit_data, ts_main_event_field_val, fk_stop_quay, fk_stop_berth 
            FROM (
                SELECT fk_control_unit_data, MAX(ts_main_event_field_val) AS max_time
                FROM trips_logs
                WHERE fk_state IN ${moorintStates}
                GROUP BY fk_control_unit_data
                ) 
            AS RES 
            INNER JOIN trips_logs AS TL 
            ON RES.fk_control_unit_data = TL.fk_control_unit_data
            INNER JOIN maneuverings
            ON TL.fk_maneuvering = maneuverings.id_maneuvering
            INNER JOIN control_unit_data
            ON control_unit_data.id_control_unit_data = TL.fk_control_unit_data 
            AND ts_main_event_field_val = max_time
            WHERE control_unit_data.fk_portinformer = ${idPortinformer}
            AND fk_ship_current_activity = ${idCurrentActivity}
            AND is_active = true
            GROUP BY RES.fk_control_unit_data, ts_main_event_field_val, fk_stop_quay, fk_stop_berth 
            ORDER BY RES.fk_control_unit_data`;
};  

let liveData = {
    moored: moored
};

module.exports = liveData;