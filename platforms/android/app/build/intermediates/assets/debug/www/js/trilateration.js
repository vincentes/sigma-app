function trilaterate(p1, p2, p3, return_middle)
{
	// based on: https://en.wikipedia.org/wiki/Trilateration
	
	// some additional local functions declared here for
	// scalar and vector operations
    
    var p1radio = p1.radio*escala;
    var p2radio = p2.radio*escala;
    var p3radio = p3.radio*escala;
    

	function sqr(a)
	{
		return a * a;
	}
	
	function norm(a)
	{
		return Math.sqrt(sqr(a.posX) + sqr(a.posY) + sqr(a.posZ));
	}
	
	function dot(a, b)
	{
		return a.posX * b.posX + a.posY * b.posY + a.posZ * b.posZ;
	}
	
	function vector_subtract(a, b)
	{
		return {
			posX: a.posX - b.posX,
			posY: a.posY - b.posY,
			posZ: a.posZ - b.posZ
		};
	}
	
	function vector_add(a, b)
	{
		return {
			posX: a.posX + b.posX,
			posY: a.posY + b.posY,
			posZ: a.posZ + b.posZ
		};
	}
	
	function vector_divide(a, b)
	{
		return {
			posX: a.posX / b,
			posY: a.posY / b,
			posZ: a.posZ / b
		};
	}
	
	function vector_multiply(a, b)
	{
		return {
			posX: a.posX * b,
			posY: a.posY * b,
			posZ: a.posZ * b
		};
	}
	
	function vector_cross(a, b)
	{
		return {
			posX: a.posY * b.posZ - a.posZ * b.posY,
			posY: a.posZ * b.posX - a.posX * b.posZ,
			posZ: a.posX * b.posY - a.posY * b.posX
		};
	}
	
	var ex, ey, ez, i, j, d, a, x, y, z, b, p4;
	
	ex = vector_divide(vector_subtract(p2, p1), norm(vector_subtract(p2, p1)));
	
	i = dot(ex, vector_subtract(p3, p1));
	a = vector_subtract(vector_subtract(p3, p1), vector_multiply(ex, i));
	ey = vector_divide(a, norm(a));
	ez =  vector_cross(ex, ey);
	d = norm(vector_subtract(p2, p1));
	j = dot(ey, vector_subtract(p3, p1));
	
	x = (sqr(p1radio) - sqr(p2radio) + sqr(d)) / (2 * d);
	y = (sqr(p1radio) - sqr(p3radio) + sqr(i) + sqr(j)) / (2 * j) - (i / j) * x;
	
	b = sqr(p1radio) - sqr(x) - sqr(y);
	
	// floating point math flaw in IEEE 754 standard
	// see https://github.com/gheja/trilateration.js/issues/2
	if (Math.abs(b) < 0.0000000001)
	{
		b = 0;
	}
	
	z = Math.sqrt(b);
	
	// no solution found
	if (isNaN(z))
	{
		return null;
	}
	
	a = vector_add(p1, vector_add(vector_multiply(ex, x), vector_multiply(ey, y)))
	p4a = vector_add(a, vector_multiply(ez, z));
	p4b = vector_subtract(a, vector_multiply(ez, z));
	
	if (z == 0 || return_middle)
	{
		return a;
	}
	else
	{
		return [ p4a, p4b ];
	}
}