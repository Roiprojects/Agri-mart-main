async function verify() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  console.log('Homepage status:', res.status);
  console.log('Has H1 heading:', html.includes('Everything Your Farm Needs.'));
  console.log('Has Tagline:', html.includes('Farm Equipment'));
  console.log('Has Description:', html.includes('Shop farm essentials, rent equipment, book agricultural services'));
  console.log('Has /shop button:', html.includes('/shop'));
  console.log('Has /crop-guidance button:', html.includes('/crop-guidance'));
  console.log('Has Banner slides/images:', html.includes('hero_showcase.jpg'));
  console.log('Has Banner navigation tabs:', html.includes('Banner 1'));
  console.log('Has Previous/Next controls:', html.includes('Previous Slide') && html.includes('Next Slide'));
}

verify().catch(console.error);
