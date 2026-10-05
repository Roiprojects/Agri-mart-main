import { NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';

export const initialMessageTemplates = [
  {
    id: '1',
    name: 'Blog.BlogComment',
    subject: '%Store.Name%. New blog comment.',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Hello Administrator,\n\nA new blog comment has been posted by %BlogComment.CustomerName% on blog post "%BlogPost.Title%".\n\nComment: %BlogComment.CommentText%',
  },
  {
    id: '2',
    name: 'Customer.BackInStock',
    subject: '%Store.Name%. Back in stock notification',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nThe product "%Product.Name%" is now back in stock and ready to order on %Store.Name%.\n\nProduct link: %Product.ProductURL%',
  },
  {
    id: '3',
    name: 'Customer.EmailRevalidationMessage',
    subject: '%Store.Name%. Email validation',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nPlease revalidate your email address by clicking on the link below:\n%Customer.EmailRevalidationURL%',
  },
  {
    id: '4',
    name: 'Customer.EmailValidationMessage',
    subject: '%Store.Name%. Email validation',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nWelcome to %Store.Name%! To activate your farmer account, please verify your email address:\n%Customer.EmailValidationURL%',
  },
  {
    id: '5',
    name: 'Customer.NewCustomer',
    subject: '%Store.Name%. New customer registration.',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'A new farmer or vendor %Customer.FullName% (%Customer.Email%) has registered on %Store.Name%.',
  },
  {
    id: '6',
    name: 'Customer.PasswordRecovery',
    subject: '%Store.Name%. Password recovery token',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nTo reset your password, visit the following URL:\n%Customer.PasswordRecoveryURL%',
  },
  {
    id: '7',
    name: 'Customer.WelcomeMessage',
    subject: 'Welcome to %Store.Name% Agri Network',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Welcome to %Store.Name%! Explore certified seeds, farming machinery rentals, and expert agronomy advisory.',
  },
  {
    id: '8',
    name: 'News.NewsComment',
    subject: '%Store.Name%. New news comment.',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Hello Administrator,\n\nA new comment has been posted on news article "%NewsItem.Title%":\n%NewsComment.CommentText%',
  },
  {
    id: '9',
    name: 'OrderCompleted.CustomerNotification',
    subject: '%Store.Name%. Your order #%Order.OrderNumber% has been completed',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Order.CustomerFullName%,\n\nYour order #%Order.OrderNumber% for agri inputs has been fulfilled and delivered successfully.',
  },
  {
    id: '10',
    name: 'OrderPaid.CustomerNotification',
    subject: '%Store.Name%. Payment received for order #%Order.OrderNumber%',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Payment of %Order.OrderTotal% received successfully for order #%Order.OrderNumber%.',
  },
  {
    id: '11',
    name: 'OrderPlaced.CustomerNotification',
    subject: '%Store.Name%. Order #%Order.OrderNumber% details',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Thank you for your order #%Order.OrderNumber%! Total: %Order.OrderTotal%. Our district logistics team will dispatch your consignment shortly.',
  },
  {
    id: '12',
    name: 'OrderPlaced.VendorNotification',
    subject: '%Store.Name%. New agricultural order #%Order.OrderNumber% placed',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Vendor Notice: New order #%Order.OrderNumber% placed containing your vendor catalog items.',
  },
  {
    id: '13',
    name: 'OrderShipped.CustomerNotification',
    subject: '%Store.Name%. Your order #%Order.OrderNumber% has shipped',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Your seeds, agrochemicals, or equipment consignment has been dispatched. Tracking: %Order.TrackingNumber%.',
  },
  {
    id: '14',
    name: 'Rental.BookingConfirmed',
    subject: '%Store.Name%. Farm machinery booking confirmed for %Rental.StartDate%',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nYour machinery rental for %Rental.MachineryName% from %Rental.StartDate% to %Rental.EndDate% has been confirmed.',
  },
  {
    id: '15',
    name: 'Service.AssignedTechnician',
    subject: '%Store.Name%. Drone spray technician assigned for field spraying',
    isActive: true,
    limitedToStores: 'All stores',
    body: 'Dear %Customer.FullName%,\n\nCertified drone pilot %Service.TechnicianName% has been assigned for your field spraying request on %Service.ScheduledDate%.',
  },
];

export async function GET() {
  try {
    if (!(devDb as any).data) {
      (devDb as any).data = {};
    }
    if (!(devDb as any).data.messageTemplates || (devDb as any).data.messageTemplates.length === 0) {
      (devDb as any).data.messageTemplates = [...initialMessageTemplates];
      try {
        (devDb as any).save?.();
      } catch (e) {}
    }
    return NextResponse.json({ success: true, data: (devDb as any).data.messageTemplates });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Template name is required' }, { status: 400 });
    }

    if (!(devDb as any).data) {
      (devDb as any).data = {};
    }
    if (!(devDb as any).data.messageTemplates) {
      (devDb as any).data.messageTemplates = [...initialMessageTemplates];
    }

    const newTemplate = {
      id: body.id || `msg-${Date.now()}`,
      name: body.name.trim(),
      subject: body.subject?.trim() || '',
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      limitedToStores: body.limitedToStores || 'All stores',
      body: body.body || '',
    };

    (devDb as any).data.messageTemplates.push(newTemplate);
    try {
      (devDb as any).save?.();
    } catch (e) {}

    return NextResponse.json({ success: true, data: newTemplate });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
