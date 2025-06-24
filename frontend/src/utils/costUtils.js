export function sumItemCost(items = [], selectedIds = null) {
  return items.reduce((total, item) => {
    if (selectedIds && !selectedIds.includes(item.id)) {
      return total;
    }
    if (item.costMode === 'fixed' && item.cost) {
      return total + parseFloat(item.cost);
    }
    if (item.costMode === 'range' && item.minCost) {
      return total + parseFloat(item.minCost);
    }
    return total;
  }, 0);
}

export function calculateEventCost({ activities = [], supports = [], selectedActivities = null, selectedSupports = null } = {}) {
  const activityTotal = sumItemCost(activities, selectedActivities);
  const supportTotal = sumItemCost(supports, selectedSupports);
  return activityTotal + supportTotal;
}
