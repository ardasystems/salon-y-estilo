import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, professional PDF receipt for an order
 * @param {Object} order - The completed order object
 * @param {Object} settings - Store settings
 */
export function generateReceiptPDF(order, settings = {}) {
  if (!order) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const storeName = settings.storeName || 'Salon&Estilo';
  const brandSubtitle = settings.brandSubtitle || 'Salón de Belleza Miluska Vidaurre';
  const salonAddress = settings.salonAddress || 'Chiclayo, Lambayeque - Perú';
  const whatsapp = settings.whatsappContact || '920 731 163';

  // Colors
  const darkGold = [179, 142, 60];
  const darkBg = [20, 20, 22];
  const grayText = [100, 100, 105];
  const lightGrayBg = [245, 245, 248];

  // Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 38, 'F');

  // Gold accent bar
  doc.setFillColor(...darkGold);
  doc.rect(0, 38, 210, 2, 'F');

  // Store Brand in Header
  doc.setTextColor(235, 195, 115);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(storeName.toUpperCase(), 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 205);
  doc.text(brandSubtitle, 14, 25);
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 165);
  doc.text(`${salonAddress}  •  WhatsApp: +${whatsapp}`, 14, 31);

  // Order Badge / Info on Right of Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('COMPROBANTE DE PEDIDO', 196, 17, { align: 'right' });
  doc.setFontSize(10);
  doc.setTextColor(235, 195, 115);
  doc.text(`N° ${order.id || 'PEDIDO'}`, 196, 24, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 185);
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }) : new Date().toLocaleString('es-PE');
  doc.text(`Fecha: ${orderDate}`, 196, 30, { align: 'right' });

  let y = 48;

  // Customer & Dispatch Details Box
  doc.setFillColor(...lightGrayBg);
  doc.roundedRect(14, y, 182, 34, 2, 2, 'F');

  doc.setTextColor(40, 40, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DATOS DEL CLIENTE', 18, y + 7);
  doc.text('MODALIDAD DE ENTREGA', 110, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 65);

  const customerName = order.customer?.name || 'Cliente';
  const customerDni = order.customer?.dni ? `DNI/CE: ${order.customer.dni}` : '';
  const customerPhone = order.customer?.phone ? `Celular: ${order.customer.phone}` : '';
  
  doc.text(`Cliente: ${customerName}`, 18, y + 14);
  if (customerDni) doc.text(customerDni, 18, y + 20);
  if (customerPhone) doc.text(customerPhone, 18, y + 26);

  const isPickup = order.shippingMethod?.id === 'salon_pickup' || 
                   order.shippingMethod?.id === 'chiclayo_pickup' || 
                   order.shippingMethod?.price === 0 ||
                   /retiro/i.test(order.shippingMethod?.title || '');

  const deliveryTitle = order.shippingMethod?.title || (isPickup ? 'Retiro en Salón' : 'Envío a Domicilio');
  doc.text(`Método: ${deliveryTitle}`, 110, y + 14);

  if (isPickup) {
    doc.setTextColor(179, 142, 60);
    doc.setFont('helvetica', 'bold');
    doc.text('Recojo en Salón de Belleza', 110, y + 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 85);
    doc.text(salonAddress, 110, y + 26);
  } else {
    const address = order.customer?.address || 'Dirección indicada';
    const city = [order.customer?.district, order.customer?.city].filter(Boolean).join(', ');
    doc.setFontSize(8);
    doc.text(`Destino: ${address}`, 110, y + 20);
    if (city) doc.text(`Ciudad/Distrito: ${city}`, 110, y + 25);
  }

  y += 42;

  // Table Headers
  doc.setFillColor(235, 235, 240);
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(40, 40, 45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  doc.text('CANT.', 18, y + 5.5);
  doc.text('DESCRIPCIÓN DEL PRODUCTO', 36, y + 5.5);
  doc.text('P. UNIT.', 150, y + 5.5, { align: 'right' });
  doc.text('SUBTOTAL', 190, y + 5.5, { align: 'right' });

  y += 9;

  // Table Items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 55);

  const items = order.items || [];
  items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor(250, 250, 252);
      doc.rect(14, y - 1, 182, 8, 'F');
    }

    const qty = item.quantity || 1;
    const price = Number(item.price) || 0;
    const lineTotal = qty * price;
    const name = item.name || 'Producto';

    // Truncate name if too long
    const displayName = name.length > 55 ? name.substring(0, 52) + '...' : name;

    doc.text(String(qty), 22, y + 4.5, { align: 'center' });
    doc.text(displayName, 36, y + 4.5);
    doc.text(`S/ ${price.toFixed(2)}`, 150, y + 4.5, { align: 'right' });
    doc.text(`S/ ${lineTotal.toFixed(2)}`, 190, y + 4.5, { align: 'right' });

    // Underline divider
    doc.setDrawColor(230, 230, 235);
    doc.line(14, y + 7, 196, y + 7);

    y += 8;
  });

  y += 5;

  // Financial Totals Box on Right
  const totalsX = 120;
  const totalsWidth = 76;
  const subtotal = Number(order.subtotal) || items.reduce((acc, it) => acc + (it.price * (it.quantity || 1)), 0);
  const shippingPrice = Number(order.shippingMethod?.price) || 0;
  const total = Number(order.total) || (subtotal + shippingPrice);

  doc.setFillColor(...lightGrayBg);
  doc.roundedRect(totalsX, y, totalsWidth, 32, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 85);
  doc.text('Subtotal:', totalsX + 6, y + 7);
  doc.text(`S/ ${subtotal.toFixed(2)}`, totalsX + totalsWidth - 6, y + 7, { align: 'right' });

  doc.text('Costo de Despacho:', totalsX + 6, y + 14);
  const shippingText = shippingPrice === 0 ? 'GRATIS (S/ 0.00)' : `S/ ${shippingPrice.toFixed(2)}`;
  doc.text(shippingText, totalsX + totalsWidth - 6, y + 14, { align: 'right' });

  // Divider
  doc.setDrawColor(200, 200, 205);
  doc.line(totalsX + 6, y + 18, totalsX + totalsWidth - 6, y + 18);

  // Grand Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 25);
  doc.text('TOTAL:', totalsX + 6, y + 26);
  doc.setTextColor(179, 142, 60);
  doc.text(`S/ ${total.toFixed(2)}`, totalsX + totalsWidth - 6, y + 26, { align: 'right' });

  // Payment note on left of totals
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 95);
  const paymentMethodLabel = {
    yape_direct: 'Billetera Digital Yape',
    plin_direct: 'Billetera Digital Plin',
    culqi_card: 'Tarjeta de Débito / Crédito',
    culqi_yape: 'Yape Oficial'
  }[order.paymentMethod] || 'Pago Acordado / Yape / Plin';

  doc.text(`Método de Pago: ${paymentMethodLabel}`, 14, y + 10);
  doc.text(`Estado del Pago: ${order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDIENTE DE VERIFICACIÓN'}`, 14, y + 16);
  if (order.paymentProofName) {
    doc.setTextColor(179, 142, 60);
    doc.text(`Constancia Adjunta: ${order.paymentProofName}`, 14, y + 21);
    doc.setTextColor(90, 90, 95);
    doc.text('Comprobante emitido para control y confirmación de despacho.', 14, y + 26);
  } else {
    doc.text('Comprobante emitido para control y confirmación de despacho.', 14, y + 22);
  }

  // Footer Note
  y += 44;
  doc.setDrawColor(220, 220, 225);
  doc.line(14, y, 196, y);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 125);
  doc.text('¡Gracias por elegir Salon&Estilo Miluska Vidaurre! Tu belleza y cuidado en manos expertas.', 105, y + 8, { align: 'center' });
  doc.text(`Para cualquier consulta sobre tu orden, escríbenos al WhatsApp: +${whatsapp}`, 105, y + 13, { align: 'center' });

  // Save / Trigger Download
  const filename = `Recibo_SalonEstilo_${order.id || 'Pedido'}.pdf`;
  doc.save(filename);
}
