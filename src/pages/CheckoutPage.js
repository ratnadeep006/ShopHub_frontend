import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/CheckoutPage.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { getCart, createOrder } from '../services/api';

function CheckoutPage() {
  const navigate = useNavigate();

  // =========================
  // BASIC STATES
  // =========================

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // =========================
  // ADDRESS STATES
  // =========================

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    is_default: false
  });

  // =========================
  // COUPON STATES
  // =========================

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const user_id = localStorage.getItem('user_id');

  // =========================
  // FETCH CART
  // =========================

  useEffect(() => {
    if (!user_id) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);

        const response = await getCart(user_id);

        if (response.success) {
          setCartItems(response.data || []);
        } else {
          toast.error('Failed to load cart');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user_id, navigate]);

  // =========================
  // FETCH ADDRESSES
  // =========================

  useEffect(() => {
    if (!user_id) return;

    const fetchAddresses = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/addresses/${user_id}`
        );

        const data = await response.json();

        if (data.success) {
          const addressList = data.data || [];

          setAddresses(addressList);

          // Automatically select default address
          const defaultAddress = addressList.find(
            (address) => address.is_default
          );

          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          } else if (addressList.length > 0) {
            setSelectedAddress(addressList[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, [user_id]);

  // =========================
  // CALCULATE TOTAL
  // =========================

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    setTotalPrice(total);
  }, [cartItems]);

  // =========================
  // FINAL AMOUNT
  // =========================

  const finalAmount = Math.max(totalPrice - discount, 0);

  // =========================
  // APPLY COUPON
  // =========================

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (couponApplied) {
      toast.info('Coupon is already applied');
      return;
    }

    try {
      setCouponLoading(true);

      const response = await fetch(
        'http://localhost:5000/api/coupons/validate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code: couponCode.trim().toUpperCase(),
            order_amount: totalPrice
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        const discountAmount =
          Number(data.data.discountAmount) || 0;

        setDiscount(discountAmount);
        setCouponApplied(true);

        // Make sure code is stored in uppercase
        setCouponCode(data.data.code || couponCode.trim().toUpperCase());

        toast.success(
          `Coupon applied! You save ₹${discountAmount.toLocaleString(
            'en-IN'
          )}`
        );
      } else {
        toast.error(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Coupon error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  // =========================
  // REMOVE COUPON
  // =========================

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setDiscount(0);

    toast.info('Coupon removed');
  };

  // =========================
  // ADDRESS FORM CHANGE
  // =========================

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddressForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================
  // SAVE NEW ADDRESS
  // =========================

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    const {
      address,
      city,
      state,
      pincode,
      phone
    } = addressForm;

    if (!address.trim() || !city.trim() || !state.trim()) {
      toast.error('Please fill all address fields');
      return;
    }

    // Pincode validation
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Pincode must be exactly 6 digits');
      return;
    }

    // Indian phone validation
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/addresses/${user_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(addressForm)
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || 'Failed to save address');
        return;
      }

      toast.success('Address saved successfully!');

      setShowAddressForm(false);

      // Reset form
      setAddressForm({
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        is_default: false
      });

      // Refresh addresses
      const refreshResponse = await fetch(
        `http://localhost:5000/api/addresses/${user_id}`
      );

      const addressData = await refreshResponse.json();

      if (addressData.success) {
        const updatedAddresses = addressData.data || [];

        setAddresses(updatedAddresses);

        // Select newest address
        if (updatedAddresses.length > 0) {
          const newestAddress =
            updatedAddresses[updatedAddresses.length - 1];

          setSelectedAddress(newestAddress);
        }
      }
    } catch (error) {
      console.error('Save address error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (placing) return;

    try {
      setPlacing(true);

      const response = await createOrder(
        user_id,
        selectedAddress.id,
        couponApplied ? couponCode.trim().toUpperCase() : null,
        couponApplied ? discount : 0
      );

      if (response.success) {
        toast.success('Order placed successfully! 🎉');

        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      } else {
        toast.error(
          'Failed to place order: ' +
            (response.message || 'Something went wrong')
        );
      }
    } catch (error) {
      console.error('Place order error:', error);

      toast.error(
        'Something went wrong while placing the order'
      );
    } finally {
      setPlacing(false);
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="loading-checkout">
          <div className="checkout-loader">⏳</div>

          <h2>Loading checkout...</h2>

          <p>
            Please wait while we prepare your order.
          </p>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <div className="empty-checkout">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything to your
            cart yet.
          </p>

          <button
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>

        <Footer />
      </>
    );
  }

  // =========================
  // MAIN CHECKOUT UI
  // =========================

  return (
    <>
      <Navbar />

      <div className="checkout-container">

        {/* PAGE TITLE */}

        <div className="checkout-header">
          <h2>Checkout</h2>
          <p>Complete your order securely</p>
        </div>

        <div className="checkout-content">

          {/* LEFT SIDE */}

          <div className="checkout-left">

            {/* DELIVERY ADDRESS */}

            <div className="checkout-section">

              <div className="section-header">
                <div>
                  <h3>📍 Delivery Address</h3>
                  <p>
                    Select where you want your order
                    delivered
                  </p>
                </div>
              </div>

              {/* SAVED ADDRESSES */}

              {addresses.length > 0 && (
                <div className="saved-addresses">

                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-option ${
                        selectedAddress?.id === addr.id
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        setSelectedAddress(addr)
                      }
                    >

                      <div className="address-radio">

                        <input
                          type="radio"
                          name="delivery-address"
                          checked={
                            selectedAddress?.id ===
                            addr.id
                          }
                          onChange={() =>
                            setSelectedAddress(addr)
                          }
                        />

                      </div>

                      <div className="address-details">

                        <div className="address-top">

                          <strong>
                            📍 {addr.address}
                          </strong>

                          {addr.is_default && (
                            <span className="default-badge">
                              Default
                            </span>
                          )}

                        </div>

                        <p className="addr-city">
                          {addr.city}, {addr.state} -{' '}
                          {addr.pincode}
                        </p>

                        <p className="addr-phone">
                          📞 {addr.phone}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>
              )}

              {/* ADD NEW ADDRESS */}

              <button
                className="add-new-address-btn"
                onClick={() =>
                  setShowAddressForm(
                    !showAddressForm
                  )
                }
              >
                {showAddressForm
                  ? '✕ Cancel'
                  : '＋ Add New Address'}
              </button>

              {/* ADDRESS FORM */}

              {showAddressForm && (
                <form
                  className="new-address-form"
                  onSubmit={handleSaveAddress}
                >

                  <h4>Add a new address</h4>

                  <div className="form-row">

                    <div className="form-group">

                      <label>Street Address</label>

                      <input
                        type="text"
                        name="address"
                        placeholder="Enter street address"
                        value={addressForm.address}
                        onChange={handleAddressChange}
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>City</label>

                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        required
                      />

                    </div>

                  </div>

                  <div className="form-row">

                    <div className="form-group">

                      <label>State</label>

                      <input
                        type="text"
                        name="state"
                        placeholder="Enter state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>Pincode</label>

                      <input
                        type="text"
                        name="pincode"
                        placeholder="6-digit pincode"
                        value={addressForm.pincode}
                        onChange={handleAddressChange}
                        maxLength="6"
                        inputMode="numeric"
                        required
                      />

                    </div>

                  </div>

                  <div className="form-group">

                    <label>Phone Number</label>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit phone number"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      maxLength="10"
                      inputMode="numeric"
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="save-address-btn"
                  >
                    💾 Save Address
                  </button>

                </form>
              )}

              {/* NO ADDRESS */}

              {!selectedAddress &&
                addresses.length === 0 && (
                  <div className="no-address-warning">
                    ⚠️ Please add a delivery address to
                    continue.
                  </div>
                )}

            </div>

            {/* COUPON */}

            <div className="checkout-section">

              <div className="section-header">
                <div>
                  <h3>🎟️ Apply Coupon</h3>
                  <p>Save more on your order</p>
                </div>
              </div>

              {!couponApplied ? (

                <div className="coupon-input-section">

                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(
                        e.target.value.toUpperCase()
                      )
                    }
                    className="coupon-input"
                  />

                  <button
                    className="apply-coupon-btn"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading
                      ? 'Applying...'
                      : 'Apply'}
                  </button>

                </div>

              ) : (

                <div className="coupon-applied">

                  <div className="coupon-success">

                    <span className="coupon-check">
                      ✓
                    </span>

                    <div>

                      <strong>
                        {couponCode} applied
                      </strong>

                      <p>
                        You saved ₹
                        {discount.toLocaleString(
                          'en-IN'
                        )}
                      </p>

                    </div>

                  </div>

                  <button
                    className="remove-coupon-btn"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>

                </div>

              )}

            </div>

            {/* REVIEW ITEMS */}

            <div className="checkout-section">

              <div className="section-header">
                <div>

                  <h3>📦 Review Items</h3>

                  <p>
                    {cartItems.length}{' '}
                    {cartItems.length === 1
                      ? 'item'
                      : 'items'}{' '}
                    in your order
                  </p>

                </div>
              </div>

              <div className="checkout-items">

                {cartItems.map((item) => (

                  <div
                    key={item.product_id}
                    className="checkout-item"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="item-info">

                      <p className="item-name">
                        {item.name}
                      </p>

                      <p className="item-qty">
                        Quantity: {item.quantity}
                      </p>

                      <p className="item-single-price">
                        ₹
                        {Number(
                          item.price
                        ).toLocaleString('en-IN')}{' '}
                        each
                      </p>

                    </div>

                    <p className="item-price">
                      ₹
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toLocaleString('en-IN')}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="checkout-right">

            <div className="checkout-summary">

              <h3>Order Summary</h3>

              {/* SUBTOTAL */}

              <div className="summary-row">

                <span>
                  Subtotal ({cartItems.length}{' '}
                  {cartItems.length === 1
                    ? 'item'
                    : 'items'})
                </span>

                <span>
                  ₹
                  {totalPrice.toLocaleString('en-IN')}
                </span>

              </div>

              {/* DISCOUNT */}

              {discount > 0 && (

                <div className="summary-row discount-row">

                  <span>Coupon Discount</span>

                  <span className="discount-text">
                    -₹
                    {discount.toLocaleString(
                      'en-IN'
                    )}
                  </span>

                </div>

              )}

              {/* SHIPPING */}

              <div className="summary-row">

                <span>Shipping</span>

                <span className="free">
                  FREE
                </span>

              </div>

              {/* TOTAL */}

              <div className="summary-divider"></div>

              <div className="summary-row total">

                <span>Total Amount</span>

                <span>
                  ₹
                  {finalAmount.toLocaleString(
                    'en-IN'
                  )}
                </span>

              </div>

              {/* SELECTED ADDRESS */}

              {selectedAddress && (

                <div className="selected-address-preview">

                  <div className="preview-title">
                    📍 Delivering to
                  </div>

                  <strong>
                    {selectedAddress.address}
                  </strong>

                  <p>
                    {selectedAddress.city},{' '}
                    {selectedAddress.state} -{' '}
                    {selectedAddress.pincode}
                  </p>

                  <p>
                    📞 {selectedAddress.phone}
                  </p>

                </div>

              )}

              {/* PLACE ORDER */}

              <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={
                  placing || !selectedAddress
                }
              >
                {placing
                  ? '⏳ Placing Order...'
                  : '✓ Place Order'}
              </button>

              {/* ADDRESS WARNING */}

              {!selectedAddress && (

                <p className="address-warning">
                  ⚠️ Please select a delivery address
                </p>

              )}

              {/* CHECKOUT FEATURES */}

              <div className="checkout-footer">

                <p>
                  🔒 Secure checkout
                </p>

                <p>
                  ✓ Money-back guarantee
                </p>

                <p>
                  🚚 Free delivery above ₹500
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default CheckoutPage;