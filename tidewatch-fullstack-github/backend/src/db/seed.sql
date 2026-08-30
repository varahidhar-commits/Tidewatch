-- Sample fleet + zone + weather data (Thoothukudi coast, Tamil Nadu)

INSERT INTO vessels (id, name, mmsi, captain_name, home_port, license_no, license_expiry) VALUES
  ('TV-104', 'Kadal Rani',   '419008104', 'R. Murugan', 'Thoothukudi Harbor', 'TN-FISH-1104', '2027-03-01'),
  ('TV-217', 'Meen Kadal',   '419008217', 'S. Antony',  'Thoothukudi Harbor', 'TN-FISH-1217', '2027-06-15'),
  ('TV-330', 'Vela Veeran',  '419008330', 'K. Joseph',  'Thoothukudi Harbor', 'TN-FISH-1330', '2026-11-20'),
  ('TV-441', 'Kadal Kanni',  '419008441', 'P. Selvam',  'Thoothukudi Harbor', 'TN-FISH-1441', '2027-01-10'),
  ('TV-552', 'Then Thendral','419008552', 'A. Regan',   'Thoothukudi Harbor', 'TN-FISH-1552', '2027-08-05')
ON CONFLICT (id) DO NOTHING;

INSERT INTO geofences (name, kind, polygon_geojson, active_from, active_to) VALUES
  ('Restricted Zone R-3', 'restricted',
   '{"type":"Polygon","coordinates":[[[77.40,8.38],[77.50,8.38],[77.50,8.46],[77.40,8.46],[77.40,8.38]]]}',
   NULL, NULL);

INSERT INTO weather_readings (region, wave_height_m, wind_speed_kn, visibility_km) VALUES
  ('Thoothukudi', 0.9, 13, 8.2);
