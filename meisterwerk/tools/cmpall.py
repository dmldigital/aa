import sys,glob,os
from PIL import Image, ImageChops
a,b=sys.argv[1],sys.argv[2]; bad=0; n=0
for f in sorted(glob.glob(a+'/*.png')):
    g=b+'/'+os.path.basename(f); n+=1
    A=Image.open(f).convert('RGB'); B=Image.open(g).convert('RGB')
    if A.size!=B.size: print('GRÖSSE',os.path.basename(f),A.size,B.size); bad+=1; continue
    bb=ImageChops.difference(A,B).getbbox()
    if bb: print('ABWEICHUNG',os.path.basename(f),bb); bad+=1
print(f'{n} Vergleiche, {bad} Abweichungen')
