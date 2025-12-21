import { Component, OnInit } from '@angular/core';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { ApiMainService } from '../services/api-main-service';

export interface DeliveryItem {
  name: string;
  qty: number;
}

export interface Delivery {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerAvatar?: string;
  distance: string;
  duration: string;
  earning: number;
  estEarningLabel?: string;
  photoUrl?: string;
  state: 'available' | 'active' | 'pickedUp' | 'navigating' | 'verifying';
  items?: DeliveryItem[];
  otp?: string; // Mock OTP
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  user = {
    name: 'Alex Rider',
    isOnline: true,
    avatar: 'https://i.pravatar.cc/150?img=11'
  };

  // Default stats
  stats: any = {
    earned: 0,
    rating: 0,
    trips: 0,
    assigned: 0,
    inscan: 0,
    picked: 0
  };

  dashboardData: any = {};

  activeTab: 'available' | 'active' = 'available';

  deliveries: Delivery[] = [
    {
      id: '44229',
      restaurantName: 'Burger King',
      restaurantAddress: '1280 Massachusetts Ave',
      customerName: 'Sarah J.',
      customerAddress: '124 Innovation Drive, Apt 4B, 3rd Floor',
      customerPhone: '+1 555-0123',
      customerAvatar: 'https://i.pravatar.cc/150?img=5',
      distance: '2.4 km',
      duration: '12 min',
      earning: 14.20,
      state: 'available',
      otp: '1234', // Mock OTP
      items: [
        { name: 'Large Pepperoni Feast', qty: 1 },
        { name: 'Coke Zero (500ml)', qty: 3 },
        { name: 'Garlic Bread', qty: 1 }
      ]
    },
    {
      id: 'ORD-002',
      restaurantName: 'Starbucks Coffee',
      restaurantAddress: 'Main St Corner, West End',
      customerName: 'City Library',
      customerAddress: 'Reception Desk, Civic Center',
      distance: '1.2 km',
      duration: '8 min',
      earning: 8.50,
      state: 'available',
      otp: '1234'
    }
  ];

  activeDeliveries: Delivery[] = [];
  enteredOtp: string = '';

  constructor(
    private toastCtrl: ToastController,
    private apiService: ApiMainService
  ) { }

  selectedFilter: 'assigned' | 'pending' | 'delivered' = 'assigned';

  ngOnInit() {
    this.loadDashboard();
    // defaulting to pending if user wants, or keep as is.
  }

  onStatClick(type: 'assigned' | 'pending' | 'delivered') {
    this.selectedFilter = type;
    if (type === 'pending') {
      this.fetchPendingDeliveries();
    } else {
      // Handle other types or clear list
      this.deliveries = [];
    }
  }

  fetchPendingDeliveries() {
    const session = localStorage.getItem('user_session');
    if (session) {
      const user = JSON.parse(session);
      const dpid = user.Id || user.DPId || user.id || 1;

      this.apiService.getPendingDeliveries(dpid).subscribe((res: any) => {
        console.log('Pending Deliveries:', res);
        if (res && res.Table) {
          this.deliveries = res.Table.map((item: any) => ({
            id: item.OrderNo || item.Id || '#',
            restaurantName: item.RestaurantName || 'Unknown Store',
            restaurantAddress: item.RestaurantAddress || '',
            customerName: item.CustomerName || 'Customer',
            customerAddress: item.ToAddress || item.CustomerAddress || '',
            distance: item.Distance || '0 km',
            duration: '0 min', // Mock or calculate
            earning: item.DeliveryAmt || 0,
            state: 'available',
            items: [] // Populate if item details are available
          }));
        }
      }, err => {
        console.error('Error fetching pending', err);
      });
    }
  }

  loadDashboard() {
    const session = localStorage.getItem('user_session');
    console.log(session);
    if (session) {
      try {
        const user = JSON.parse(session);
        // Assuming the ID property is 'Id' or 'DPId' or just 'id' in the login response.
        // I'll try to find 'Id' first as per common convention in .NET/SQL APIs, or properties from previous context.
        // Based on Profile page logic which uses 'user' object directly...
        // Let's assume user.Id exists. I will log it to be sure.
        console.log('User Session:', user);

        // Use user.Id if available, fallback strategies can be added if I see the log structure.
        const dpid = user.Id || user.DPId || user.id || 1;

        if (dpid) {
          this.apiService.getDPDashboard(dpid).subscribe((res: any) => {
            console.log('Dashboard Data:', res);
            // The API returns the object directly, not wrapped in Table based on user input
            // But let's check if it needs parsing or if it's the object itself.
            // User input: { "PickupAssigned": 0, ... }
            if (res) {
              const data = (res.Table && res.Table.length > 0) ? res.Table[0] : res;
              this.dashboardData = data;

              // Map API data to stats
              // We'll map 'Delivered' to 'Trips' for now.
              // 'Earned' and 'Rating' are not in the response, so we keep defaults or placeholders.

              this.stats.trips = data.Delivered || 0;
              // this.stats.earned = ... // Not provided
              // this.stats.rating = ... // Not provided

              // We can expose the other metrics if needed
              this.stats['assigned'] = data.PickupAssigned || 0;
              this.stats['inscan'] = data.PickupInscan || 0;
              this.stats['picked'] = data.PickupPicked || 0;
            }
          }, (err) => {
            console.error('Error fetching dashboard', err);
          });
        }
      } catch (e) {
        console.error('Error parsing session', e);
      }
    }
  }

  segmentChanged(ev: any) {
    this.activeTab = ev.detail.value;
  }

  acceptOrder(delivery: Delivery) {
    this.deliveries = this.deliveries.filter(d => d.id !== delivery.id);
    delivery.state = 'active'; // Ready for upload
    this.activeDeliveries.push(delivery);
    this.activeTab = 'active';
  }

  onFileSelected(event: any, delivery: Delivery) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        delivery.photoUrl = e.target.result;
        delivery.state = 'pickedUp'; // Move to En Route view
      };
      reader.readAsDataURL(file);
    }
  }

  startNavigation(delivery: Delivery) {
    delivery.state = 'navigating';
  }

  stopNavigation(delivery: Delivery) {
    delivery.state = 'pickedUp';
  }

  requestCompletion(delivery: Delivery) {
    this.enteredOtp = ''; // Reset OTP input
    delivery.state = 'verifying';
  }

  // OTP Numpad Logic
  onDigitPress(digit: number) {
    if (this.enteredOtp.length < 4) {
      this.enteredOtp += digit;
    }
  }

  onClearPress() {
    this.enteredOtp = '';
  }

  onBackspacePress() {
    if (this.enteredOtp.length > 0) {
      this.enteredOtp = this.enteredOtp.slice(0, -1);
    }
  }

  async verifyAndComplete(delivery: Delivery) {
    if (this.enteredOtp === delivery.otp) {
      // Success
      const toast = await this.toastCtrl.create({
        message: 'Delivery Completed Successfully! +$' + delivery.earning.toFixed(2),
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      toast.present();

      // Remove from active list
      this.activeDeliveries = this.activeDeliveries.filter(d => d.id !== delivery.id);

      // Update stats (mock)
      this.stats.earned += delivery.earning;
      this.stats.trips += 1;

      // Reset tabs if no active deliveries
      if (this.activeDeliveries.length === 0) {
        this.activeTab = 'available';
      }

    } else {
      // Error
      const toast = await this.toastCtrl.create({
        message: 'Incorrect PIN. Please try again.',
        duration: 1500,
        color: 'danger',
        position: 'top'
      });
      toast.present();
      this.enteredOtp = ''; // Optional: clear on error
    }
  }

  cancelVerification(delivery: Delivery) {
    delivery.state = 'pickedUp';
  }
}
