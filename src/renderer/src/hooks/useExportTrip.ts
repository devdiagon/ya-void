export const fetchAllWorkZonesFarmRelatedTrips = async (
  workZoneId: number,
  farmWorkZoneId: number
) => {
  try {
    return await window.api.workZones.getAllWorkZonesTrips(workZoneId, farmWorkZoneId);
  } catch (err) {
    console.error(err);
    return [];
  }
};
