import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

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
export class Tab1Page {

  user = {
    name: 'Alex Rider',
    isOnline: true,
    avatar: 'https://i.pravatar.cc/150?img=11'
  };

  stats = {
    earned: 142.50,
    rating: 4.9,
    trips: 12
  };

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

  constructor(private toastCtrl: ToastController) { }

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
