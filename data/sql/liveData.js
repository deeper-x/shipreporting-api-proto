let moored = function (idPortinformer, idCurrentActivity) {
    return `SELECT RES.fk_control_unit_data, ts_main_event_field_val FROM (
        SELECT fk_control_unit_data, MAX(ts_main_event_field_val) as max_time
        FROM trips_logs
        GROUP BY fk_control_unit_data) as RES 
        INNER JOIN trips_logs as TL 
        ON RES.fk_control_unit_data = TL.fk_control_unit_data
        INNER JOIN control_unit_data
        ON control_unit_data.id_control_unit_data = TL.fk_control_unit_data 
        AND ts_main_event_field_val = max_time
        WHERE control_unit_data.fk_portinformer = ${idPortinformer}
        AND fk_ship_current_activity = ${idCurrentActivity}
        AND is_active = true`;
};  


let liveData = {
    moored: moored
};

module.exports = liveData;