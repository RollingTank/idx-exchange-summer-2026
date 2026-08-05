import React from "react";
import "./OpenHouses.css";

const formatDate = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    const dateOnlyMatch = String(dateValue).match(/^\d{4}-\d{2}-\d{2}/);
    if (!dateOnlyMatch) return String(dateValue);

    const [year, month, day] = dateOnlyMatch[0].split("-");
    return `${month}-${day}-${year}`;
  }

  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const year = parsedDate.getFullYear();

  return `${month}-${day}-${year}`;
};

const formatTime = (timeValue) => {
  if (!timeValue) return "Time unavailable";

  const [hoursRaw, minutesRaw] = String(timeValue).split(":");
  const hours = Number(hoursRaw);
  const minutes = minutesRaw ?? "00";

  if (Number.isNaN(hours)) return String(timeValue);

  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${normalizedHours}:${minutes.slice(0, 2).padEnd(2, "0")} ${suffix}`;
};

export const getOpenHouseRemarks = (openHouse) => {
  if (!openHouse || !openHouse.all_data) return "";
  try {
    const parsedData =
      typeof openHouse.all_data === "string"
        ? JSON.parse(openHouse.all_data)
        : openHouse.all_data;
    return parsedData.OpenHouseRemarks || "";
  } catch (err) {
    return "";
  }
};

export default function OpenHouses({ openHouses }) {
  if (!openHouses || openHouses.length === 0) {
    return <p className="no-open-houses">No open houses scheduled</p>;
  }

  return (
    <div className="open-houses-container">
      <h3>Upcoming Open Houses</h3>
      <div className="open-houses-list">
        {openHouses.map((oh, index) => {
          const remarks = getOpenHouseRemarks(oh);
          return (
            <div key={oh.OpenHouseKey || index} className="open-house-card">
              <div className="open-house-date">
                <strong>Date:</strong> {formatDate(oh.OpenHouseDate)}
              </div>
              <div className="open-house-time">
                <strong>Time:</strong> {formatTime(oh.OH_StartTime)} -{" "}
                {formatTime(oh.OH_EndTime)}
              </div>
              {remarks && (
                <div className="open-house-remarks">
                  <strong>Remarks:</strong> {remarks}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
