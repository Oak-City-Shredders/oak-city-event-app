// Define statusOrder first
export const statusOrder = {
  'Now Serving': 1,
  'Opening Soon': 2,
  'Coming Later': 3,
  Closed: 4,
} as const; // `as const` ensures literal types

// Define StatusMessage type next
export type StatusMessage = keyof typeof statusOrder;

// Define interfaces after types are available
export interface FireDBFoodTruck {
  Image: string;
  IsOpenForOrders: string;
  Location: string;
  Menu: string;
  Name: string;
  Notes: string;
  PlannedSchedule: any | string;
  link: string;
  description: string;
  Category: string;
  id: string;
  popularItem: string;
  popularItemPrice: string;
  statusMessage: string;
}

export interface MappedFoodTruck {
  image: string; // From truck.Image
  link: string; // From truck.link
  description: string; // From truck.description
  title: string; // From truck.Name
  statusMessage: StatusMessage;
  isOpenForOrders: boolean; // From Boolean(truck.IsOpenForOrders === 'Yes')
  plannedSchedule: Record<string, any>; // From JSON.parse(truck.PlannedSchedule) or empty object
  menu: string; // From truck.Menu
  category: string; // From truck.Category
  popularItem: string; // From truck.popularItem
  popularItemPrice: string; // From truck.popularItemPrice
}

// Helper function to ensure statusMessage matches the allowed values
function mapStatusMessage(input: string | undefined): StatusMessage {
  const validStatuses: StatusMessage[] = [
    'Now Serving',
    'Opening Soon',
    'Coming Later',
    'Closed',
  ];

  // Type guard to ensure the input is a valid StatusMessage
  if (input && validStatuses.includes(input as StatusMessage)) {
    return input as StatusMessage;
  }

  // Default to "Closed" if the input is invalid
  return 'Closed';
}

// Mapping function with correct syntax
export const mapFoodTruckData = (
  data: FireDBFoodTruck[]
): MappedFoodTruck[] => {
  return data.map((truck) => ({
    image: truck.Image,
    route: truck.link,
    description: truck.description,
    title: truck.Name,
    isOpenForOrders: Boolean(truck.IsOpenForOrders === 'Yes'),
    plannedSchedule: truck.PlannedSchedule
      ? JSON.parse(truck.PlannedSchedule)
      : {},
    menu: truck.Menu,
    category: truck.Category,
    popularItem: truck.popularItem,
    popularItemPrice: truck.popularItemPrice,
    statusMessage: mapStatusMessage(truck.statusMessage),
  }));
};
